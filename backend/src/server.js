require('dotenv').config();
const app = require('./app');
const prisma = require('./config/prisma');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Verify database connection before starting
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📌 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('\n👋 Server stopped gracefully');
  process.exit(0);
});

startServer();
