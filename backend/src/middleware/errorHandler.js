const { ZodError } = require('zod');
const AppError = require('../utils/AppError');

/**
 * Centralized error handling middleware.
 * Returns consistent JSON error responses without exposing server internals.
 */
const errorHandler = (err, req, res, next) => {
  // Zod validation errors
  if (err instanceof ZodError) {
    const messages = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: messages,
    });
  }

  // Prisma unique constraint violation
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'field';
    return res.status(409).json({
      success: false,
      message: `A record with this ${field} already exists.`,
    });
  }

  // Prisma record not found
  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'Record not found.',
    });
  }

  // Prisma foreign key constraint (cannot delete referenced record)
  if (err.code === 'P2003') {
    return res.status(409).json({
      success: false,
      message: 'Cannot delete this record because it is referenced by other records.',
    });
  }

  // Our custom operational errors
  if (err instanceof AppError || err.isOperational) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
    });
  }

  // Unknown/unexpected errors — do not leak details
  console.error('Unexpected error:', err);
  return res.status(500).json({
    success: false,
    message: 'An unexpected internal server error occurred.',
  });
};

module.exports = errorHandler;
