const prisma = require('../config/prisma');

/**
 * Calculates dashboard summary: total income, total expenses, balance.
 * Also returns monthly chart data and category breakdown for charts.
 * Uses Prisma aggregation — all calculations happen in PostgreSQL.
 */
const getDashboardSummary = async (userId) => {
  // Aggregate totals using DB-level sum (no JS floating-point issues)
  const [incomeAgg, expenseAgg] = await Promise.all([
    prisma.transaction.aggregate({
      where: { userId, type: 'INCOME' },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { userId, type: 'EXPENSE' },
      _sum: { amount: true },
    }),
  ]);

  const totalIncome = Number(incomeAgg._sum.amount || 0);
  const totalExpenses = Number(expenseAgg._sum.amount || 0);
  const balance = totalIncome - totalExpenses;

  // Monthly income vs expenses for the last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const monthlyTransactions = await prisma.transaction.findMany({
    where: {
      userId,
      transactionDate: { gte: sixMonthsAgo },
    },
    select: { amount: true, type: true, transactionDate: true },
    orderBy: { transactionDate: 'asc' },
  });

  // Group by month
  const monthlyMap = {};
  monthlyTransactions.forEach((tx) => {
    const date = new Date(tx.transactionDate);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const label = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    if (!monthlyMap[key]) {
      monthlyMap[key] = { month: label, income: 0, expenses: 0 };
    }
    if (tx.type === 'INCOME') {
      monthlyMap[key].income += Number(tx.amount);
    } else {
      monthlyMap[key].expenses += Number(tx.amount);
    }
  });
  const monthlyData = Object.values(monthlyMap);

  // Expense breakdown by category (for pie/donut chart)
  const expenseByCategory = await prisma.transaction.groupBy({
    by: ['categoryId'],
    where: { userId, type: 'EXPENSE' },
    _sum: { amount: true },
  });

  // Fetch category names for the grouped results
  const categoryIds = expenseByCategory.map((e) => e.categoryId);
  const categories = await prisma.category.findMany({
    where: { id: { in: categoryIds } },
    select: { id: true, name: true },
  });
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

  const categoryBreakdown = expenseByCategory
    .map((e) => ({
      name: categoryMap[e.categoryId] || 'Unknown',
      value: Number(e._sum.amount || 0),
    }))
    .sort((a, b) => b.value - a.value);

  // Recent 5 transactions
  const recentTransactions = await prisma.transaction.findMany({
    where: { userId },
    include: { category: { select: { id: true, name: true, type: true } } },
    orderBy: { transactionDate: 'desc' },
    take: 5,
  });

  return {
    summary: {
      totalIncome,
      totalExpenses,
      balance,
    },
    monthlyData,
    categoryBreakdown,
    recentTransactions,
  };
};

module.exports = { getDashboardSummary };
