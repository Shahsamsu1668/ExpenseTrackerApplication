const categoryService = require('../services/categoryService');
const { categorySchema, updateCategorySchema } = require('../validators/categoryValidators');

/**
 * GET /api/categories
 */
const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getCategories(req.user.id);
    res.status(200).json({ success: true, data: { categories } });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/categories
 */
const createCategory = async (req, res, next) => {
  try {
    const data = categorySchema.parse(req.body);
    const category = await categoryService.createCategory(req.user.id, data);
    res.status(201).json({ success: true, message: 'Category created successfully', data: { category } });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/categories/:id
 */
const updateCategory = async (req, res, next) => {
  try {
    const data = updateCategorySchema.parse(req.body);
    const category = await categoryService.updateCategory(req.user.id, req.params.id, data);
    res.status(200).json({ success: true, message: 'Category updated successfully', data: { category } });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/categories/:id
 */
const deleteCategory = async (req, res, next) => {
  try {
    await categoryService.deleteCategory(req.user.id, req.params.id);
    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
