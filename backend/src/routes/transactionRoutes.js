const express = require('express');
const {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transactionController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All transaction routes require authentication
router.use(authenticate);

router.get('/', getTransactions);
router.get('/:id', getTransactionById);
router.post('/', createTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;
