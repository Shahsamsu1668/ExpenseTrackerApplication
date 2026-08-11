const prisma = require('../config/prisma');
const AppError = require('../utils/AppError');

/**
 * Builds a Prisma where clause from query parameters.
 * All queries are scoped to the authenticated userId.
 */
const buildTransactionFilter = (userId, { search, type, categoryId, startDate, endDate }) => {
  const where = { userId };

  if (search) {
    where.title = { contains: search, mode: 'insensitive' };
  }
  if (type && ['INCOME', 'EXPENSE'].includes(type)) {
    where.type = type;
  }
  if (categoryId) {
    where.categoryId = categoryId;
  }
  if (startDate || endDate) {
    where.transactionDate = {};
    if (startDate) where.transactionDate.gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      where.transactionDate.lte = end;
    }
  }

  return where;
};

/**
 * Returns paginated transactions for the authenticated user with filters.
 */
const getTransactions = async (userId, queryParams) => {
  const { page, limit, ...filters } = queryParams;
  const skip = (page - 1) * limit;
  const where = buildTransactionFilter(userId, filters);

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: { category: { select: { id: true, name: true, type: true } } },
      orderBy: { transactionDate: 'desc' },
      skip,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    transactions,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
};

/**
 * Returns a single transaction by ID, verifying it belongs to the user.
 */
const getTransactionById = async (userId, transactionId) => {
  const transaction = await prisma.transaction.findFirst({
    where: { id: transactionId, userId },
    include: { category: { select: { id: true, name: true, type: true } } },
  });
  if (!transaction) {
    throw new AppError('Transaction not found.', 404);
  }
  return transaction;
};

/**
 * Creates a new transaction, verifying the category belongs to the user.
 */
const createTransaction = async (userId, { title, amount, type, categoryId, transactionDate }) => {
  // Verify category belongs to this user and matches transaction type
  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId },
  });
  if (!category) {
    throw new AppError('Category not found or does not belong to you.', 404);
  }
  if (category.type !== type) {
    throw new AppError(
      `Category type mismatch. Selected category is ${category.type} but transaction type is ${type}.`,
      400
    );
  }

  return prisma.transaction.create({
    data: {
      title,
      amount,
      type,
      categoryId,
      userId,
      transactionDate: new Date(transactionDate),
    },
    include: { category: { select: { id: true, name: true, type: true } } },
  });
};

/**
 * Updates an existing transaction that belongs to the authenticated user.
 */
const updateTransaction = async (userId, transactionId, updates) => {
  const existing = await prisma.transaction.findFirst({
    where: { id: transactionId, userId },
  });
  if (!existing) {
    throw new AppError('Transaction not found.', 404);
  }

  const finalType = updates.type || existing.type;
  const finalCategoryId = updates.categoryId || existing.categoryId;

  // If category or type is changing, re-verify ownership and type match
  if (updates.categoryId || updates.type) {
    const category = await prisma.category.findFirst({
      where: { id: finalCategoryId, userId },
    });
    if (!category) {
      throw new AppError('Category not found or does not belong to you.', 404);
    }
    if (category.type !== finalType) {
      throw new AppError(
        `Category type mismatch. Selected category is ${category.type} but transaction type is ${finalType}.`,
        400
      );
    }
  }

  const data = {};
  if (updates.title) data.title = updates.title;
  if (updates.amount !== undefined) data.amount = updates.amount;
  if (updates.type) data.type = updates.type;
  if (updates.categoryId) data.categoryId = updates.categoryId;
  if (updates.transactionDate) data.transactionDate = new Date(updates.transactionDate);

  return prisma.transaction.update({
    where: { id: transactionId },
    data,
    include: { category: { select: { id: true, name: true, type: true } } },
  });
};

/**
 * Deletes a transaction that belongs to the authenticated user.
 */
const deleteTransaction = async (userId, transactionId) => {
  const transaction = await prisma.transaction.findFirst({
    where: { id: transactionId, userId },
  });
  if (!transaction) {
    throw new AppError('Transaction not found.', 404);
  }

  await prisma.transaction.delete({ where: { id: transactionId } });
};

module.exports = {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
