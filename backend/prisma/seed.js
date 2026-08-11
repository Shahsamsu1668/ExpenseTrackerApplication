/**
 * Prisma Seed Script
 * Creates demo user with realistic categories and transactions.
 *
 * ⚠️  DEMO CREDENTIALS (local development only — NEVER use in production):
 *    Email:    demo@example.com
 *    Password: Demo@12345
 *
 * Run with: node prisma/seed.js
 * Or:       npm run seed
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const DEMO_USER = {
  fullName: 'Demo User',
  email: 'demo@example.com',
  password: 'Demo@12345',
};

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Business', 'Other Income'];
const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Healthcare',
  'Education',
  'Other Expense',
];

function randomAmount(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean up existing demo user
  await prisma.user.deleteMany({ where: { email: DEMO_USER.email } });

  // Create demo user
  const passwordHash = await bcrypt.hash(DEMO_USER.password, 12);
  const user = await prisma.user.create({
    data: { fullName: DEMO_USER.fullName, email: DEMO_USER.email, passwordHash },
  });
  console.log(`✅ Created demo user: ${user.email}`);

  // Create income categories
  const incomeCategories = await Promise.all(
    INCOME_CATEGORIES.map((name) =>
      prisma.category.create({ data: { name, type: 'INCOME', userId: user.id } })
    )
  );
  console.log(`✅ Created ${incomeCategories.length} income categories`);

  // Create expense categories
  const expenseCategories = await Promise.all(
    EXPENSE_CATEGORIES.map((name) =>
      prisma.category.create({ data: { name, type: 'EXPENSE', userId: user.id } })
    )
  );
  console.log(`✅ Created ${expenseCategories.length} expense categories`);

  const salaryCategory = incomeCategories.find((c) => c.name === 'Salary');
  const freelanceCategory = incomeCategories.find((c) => c.name === 'Freelance');
  const businessCategory = incomeCategories.find((c) => c.name === 'Business');
  const foodCategory = expenseCategories.find((c) => c.name === 'Food');
  const transportCategory = expenseCategories.find((c) => c.name === 'Transport');
  const shoppingCategory = expenseCategories.find((c) => c.name === 'Shopping');
  const billsCategory = expenseCategories.find((c) => c.name === 'Bills');
  const entertainmentCategory = expenseCategories.find((c) => c.name === 'Entertainment');
  const healthcareCategory = expenseCategories.find((c) => c.name === 'Healthcare');
  const educationCategory = expenseCategories.find((c) => c.name === 'Education');

  // Realistic sample transactions over the past 6 months
  const transactions = [
    // This month
    { title: 'Monthly Salary', amount: 5000, type: 'INCOME', categoryId: salaryCategory.id, transactionDate: daysAgo(2) },
    { title: 'Grocery Shopping', amount: 145.50, type: 'EXPENSE', categoryId: foodCategory.id, transactionDate: daysAgo(3) },
    { title: 'Netflix Subscription', amount: 15.99, type: 'EXPENSE', categoryId: entertainmentCategory.id, transactionDate: daysAgo(4) },
    { title: 'Freelance Project A', amount: 850, type: 'INCOME', categoryId: freelanceCategory.id, transactionDate: daysAgo(5) },
    { title: 'Electricity Bill', amount: 78.40, type: 'EXPENSE', categoryId: billsCategory.id, transactionDate: daysAgo(6) },
    { title: 'Uber Rides', amount: 42.00, type: 'EXPENSE', categoryId: transportCategory.id, transactionDate: daysAgo(7) },
    { title: 'Online Course - React', amount: 29.99, type: 'EXPENSE', categoryId: educationCategory.id, transactionDate: daysAgo(8) },
    { title: 'Restaurant Dinner', amount: 65.00, type: 'EXPENSE', categoryId: foodCategory.id, transactionDate: daysAgo(10) },

    // Last month
    { title: 'Monthly Salary', amount: 5000, type: 'INCOME', categoryId: salaryCategory.id, transactionDate: daysAgo(32) },
    { title: 'Freelance Project B', amount: 1200, type: 'INCOME', categoryId: freelanceCategory.id, transactionDate: daysAgo(35) },
    { title: 'Internet Bill', amount: 59.99, type: 'EXPENSE', categoryId: billsCategory.id, transactionDate: daysAgo(36) },
    { title: 'Supermarket', amount: 187.30, type: 'EXPENSE', categoryId: foodCategory.id, transactionDate: daysAgo(38) },
    { title: 'Clothing Purchase', amount: 230.00, type: 'EXPENSE', categoryId: shoppingCategory.id, transactionDate: daysAgo(40) },
    { title: 'Doctor Visit', amount: 95.00, type: 'EXPENSE', categoryId: healthcareCategory.id, transactionDate: daysAgo(42) },
    { title: 'Bus Pass', amount: 35.00, type: 'EXPENSE', categoryId: transportCategory.id, transactionDate: daysAgo(44) },
    { title: 'Movie Tickets', amount: 28.00, type: 'EXPENSE', categoryId: entertainmentCategory.id, transactionDate: daysAgo(46) },
    { title: 'Coffee Shop', amount: 18.50, type: 'EXPENSE', categoryId: foodCategory.id, transactionDate: daysAgo(48) },

    // 2 months ago
    { title: 'Monthly Salary', amount: 5000, type: 'INCOME', categoryId: salaryCategory.id, transactionDate: daysAgo(62) },
    { title: 'Side Business Revenue', amount: 650, type: 'INCOME', categoryId: businessCategory.id, transactionDate: daysAgo(65) },
    { title: 'Pharmacy', amount: 42.50, type: 'EXPENSE', categoryId: healthcareCategory.id, transactionDate: daysAgo(66) },
    { title: 'Grocery', amount: 162.00, type: 'EXPENSE', categoryId: foodCategory.id, transactionDate: daysAgo(68) },
    { title: 'New Shoes', amount: 120.00, type: 'EXPENSE', categoryId: shoppingCategory.id, transactionDate: daysAgo(70) },
    { title: 'Spotify Premium', amount: 9.99, type: 'EXPENSE', categoryId: entertainmentCategory.id, transactionDate: daysAgo(72) },
    { title: 'Taxi', amount: 28.00, type: 'EXPENSE', categoryId: transportCategory.id, transactionDate: daysAgo(74) },

    // 3 months ago
    { title: 'Monthly Salary', amount: 5000, type: 'INCOME', categoryId: salaryCategory.id, transactionDate: daysAgo(92) },
    { title: 'Freelance Project C', amount: 980, type: 'INCOME', categoryId: freelanceCategory.id, transactionDate: daysAgo(95) },
    { title: 'Water & Utilities', amount: 85.00, type: 'EXPENSE', categoryId: billsCategory.id, transactionDate: daysAgo(96) },
    { title: 'Weekly Groceries', amount: 201.60, type: 'EXPENSE', categoryId: foodCategory.id, transactionDate: daysAgo(98) },
    { title: 'Laptop Accessories', amount: 75.99, type: 'EXPENSE', categoryId: shoppingCategory.id, transactionDate: daysAgo(100) },
    { title: 'Concert Ticket', amount: 55.00, type: 'EXPENSE', categoryId: entertainmentCategory.id, transactionDate: daysAgo(102) },

    // 4 months ago
    { title: 'Monthly Salary', amount: 5000, type: 'INCOME', categoryId: salaryCategory.id, transactionDate: daysAgo(122) },
    { title: 'Business Project', amount: 750, type: 'INCOME', categoryId: businessCategory.id, transactionDate: daysAgo(125) },
    { title: 'Medical Checkup', amount: 110.00, type: 'EXPENSE', categoryId: healthcareCategory.id, transactionDate: daysAgo(126) },
    { title: 'Food Delivery', amount: 89.40, type: 'EXPENSE', categoryId: foodCategory.id, transactionDate: daysAgo(128) },
    { title: 'Online Subscription', amount: 49.99, type: 'EXPENSE', categoryId: entertainmentCategory.id, transactionDate: daysAgo(130) },
    { title: 'Training Course', amount: 199.00, type: 'EXPENSE', categoryId: educationCategory.id, transactionDate: daysAgo(132) },

    // 5 months ago
    { title: 'Monthly Salary', amount: 4800, type: 'INCOME', categoryId: salaryCategory.id, transactionDate: daysAgo(152) },
    { title: 'Freelance Design', amount: 600, type: 'INCOME', categoryId: freelanceCategory.id, transactionDate: daysAgo(155) },
    { title: 'Fuel', amount: 65.00, type: 'EXPENSE', categoryId: transportCategory.id, transactionDate: daysAgo(156) },
    { title: 'Supermarket Run', amount: 175.20, type: 'EXPENSE', categoryId: foodCategory.id, transactionDate: daysAgo(158) },
    { title: 'Phone Bill', amount: 45.00, type: 'EXPENSE', categoryId: billsCategory.id, transactionDate: daysAgo(160) },
    { title: 'Winter Clothing', amount: 310.00, type: 'EXPENSE', categoryId: shoppingCategory.id, transactionDate: daysAgo(162) },
  ];

  const created = await Promise.all(
    transactions.map((t) =>
      prisma.transaction.create({
        data: {
          title: t.title,
          amount: t.amount,
          type: t.type,
          categoryId: t.categoryId,
          userId: user.id,
          transactionDate: t.transactionDate,
        },
      })
    )
  );

  console.log(`✅ Created ${created.length} sample transactions`);
  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📋 Demo Credentials (LOCAL DEVELOPMENT ONLY):');
  console.log(`   Email:    ${DEMO_USER.email}`);
  console.log(`   Password: ${DEMO_USER.password}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
