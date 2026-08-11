require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const errorHandler = require('./middleware/errorHandler');

const path = require('path');

const app = express();

// Serve static files (like profile pictures)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: false, // allow images to be loaded cross-origin
}));

// CORS — allow only the configured frontend origin
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Rate limiting — 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Expense Tracker API is running', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 handler for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// Centralized error handler (must be last)
app.use(errorHandler);

module.exports = app;
