const prisma = require('../config/prisma');
const AppError = require('../utils/AppError');

/**
 * Returns all categories belonging to the authenticated user.
 */
const getCategories = async (userId) => {
  return prisma.category.findMany({
    where: { userId },
    orderBy: [{ type: 'asc' }, { name: 'asc' }],
    include: {
      _count: { select: { transactions: true } },
    },
  });
};

/**
 * Creates a new category for the authenticated user.
 * Enforces unique (name, type, userId) combination.
 */
const createCategory = async (userId, { name, type }) => {
  const existing = await prisma.category.findFirst({
    where: { name: { equals: name, mode: 'insensitive' }, type, userId },
  });
  if (existing) {
    throw new AppError(`You already have a ${type} category named "${name}".`, 409);
  }

  return prisma.category.create({
    data: { name, type, userId },
    include: { _count: { select: { transactions: true } } },
  });
};

/**
 * Updates a category that belongs to the authenticated user.
 */
const updateCategory = async (userId, categoryId, { name, type }) => {
  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId },
  });
  if (!category) {
    throw new AppError('Category not found.', 404);
  }

  // Check for duplicate if name or type is changing
  if (name || type) {
    const newName = name || category.name;
    const newType = type || category.type;
    const duplicate = await prisma.category.findFirst({
      where: {
        name: { equals: newName, mode: 'insensitive' },
        type: newType,
        userId,
        NOT: { id: categoryId },
      },
    });
    if (duplicate) {
      throw new AppError(`You already have a ${newType} category named "${newName}".`, 409);
    }
  }

  return prisma.category.update({
    where: { id: categoryId },
    data: { ...(name && { name }), ...(type && { type }) },
    include: { _count: { select: { transactions: true } } },
  });
};

/**
 * Deletes a category.
 * Blocked by Prisma's onDelete: Restrict if transactions reference it.
 */
const deleteCategory = async (userId, categoryId) => {
  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId },
    include: { _count: { select: { transactions: true } } },
  });
  if (!category) {
    throw new AppError('Category not found.', 404);
  }

  if (category._count.transactions > 0) {
    throw new AppError(
      `Cannot delete this category because it has ${category._count.transactions} transaction(s) associated with it. Please reassign or delete those transactions first.`,
      409
    );
  }

  await prisma.category.delete({ where: { id: categoryId } });
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
