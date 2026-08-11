const { z } = require('zod');

const categorySchema = z.object({
  name: z
    .string({ required_error: 'Category name is required' })
    .min(1, 'Category name is required')
    .max(50, 'Category name must not exceed 50 characters')
    .trim(),
  type: z.enum(['INCOME', 'EXPENSE'], {
    required_error: 'Category type is required',
    invalid_type_error: 'Type must be either INCOME or EXPENSE',
  }),
});

const updateCategorySchema = categorySchema.partial();

module.exports = { categorySchema, updateCategorySchema };
