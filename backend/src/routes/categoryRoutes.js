const express = require('express');
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All category routes require authentication
router.use(authenticate);

router.get('/', getCategories);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
