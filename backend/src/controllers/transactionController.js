const transactionService = require('../services/transactionService');
const {
  transactionSchema,
  updateTransactionSchema,
  transactionQuerySchema,
} = require('../validators/transactionValidators');

/**
 * GET /api/transactions
 */
const getTransactions = async (req, res, next) => {
  try {
    const queryParams = transactionQuerySchema.parse(req.query);
    const result = await transactionService.getTransactions(req.user.id, queryParams);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/transactions/:id
 */
const getTransactionById = async (req, res, next) => {
  try {
    const transaction = await transactionService.getTransactionById(req.user.id, req.params.id);
    res.status(200).json({ success: true, data: { transaction } });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/transactions
 */
const createTransaction = async (req, res, next) => {
  try {
    const data = transactionSchema.parse(req.body);
    const transaction = await transactionService.createTransaction(req.user.id, data);
    res.status(201).json({ success: true, message: 'Transaction created successfully', data: { transaction } });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/transactions/:id
 */
const updateTransaction = async (req, res, next) => {
  try {
    const data = updateTransactionSchema.parse(req.body);
    const transaction = await transactionService.updateTransaction(req.user.id, req.params.id, data);
    res.status(200).json({ success: true, message: 'Transaction updated successfully', data: { transaction } });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/transactions/:id
 */
const deleteTransaction = async (req, res, next) => {
  try {
    await transactionService.deleteTransaction(req.user.id, req.params.id);
    res.status(200).json({ success: true, message: 'Transaction deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
