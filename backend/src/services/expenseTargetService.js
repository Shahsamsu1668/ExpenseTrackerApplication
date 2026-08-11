const prisma = require('../config/prisma');
const AppError = require('../utils/AppError');

const getTarget = async (userId) => {
  return await prisma.expenseTarget.findUnique({
    where: { userId }
  });
};

const setTarget = async (userId, data) => {
  return await prisma.expenseTarget.upsert({
    where: { userId },
    update: { amount: data.amount, period: data.period },
    create: { userId, amount: data.amount, period: data.period }
  });
};

const deleteTarget = async (userId) => {
  const target = await prisma.expenseTarget.findUnique({ where: { userId } });
  if (!target) throw new AppError('Expense target not found', 404);
  
  await prisma.expenseTarget.delete({ where: { userId } });
};

const getStatus = async (userId) => {
  const target = await prisma.expenseTarget.findUnique({ where: { userId } });
  if (!target) return null;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const expenses = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: {
      userId,
      type: 'EXPENSE',
      transactionDate: {
        gte: startOfMonth,
        lte: endOfMonth
      }
    }
  });

  const spent = expenses._sum.amount ? parseFloat(expenses._sum.amount) : 0;
  const targetAmount = parseFloat(target.amount);
  const remaining = Math.max(0, targetAmount - spent);
  const percentage = targetAmount > 0 ? (spent / targetAmount) * 100 : 0;
  const isExceeded = spent > targetAmount;
  const exceededBy = isExceeded ? spent - targetAmount : 0;

  return {
    target: targetAmount,
    spent,
    remaining,
    percentage,
    isExceeded,
    exceededBy
  };
};

module.exports = { getTarget, setTarget, deleteTarget, getStatus };
