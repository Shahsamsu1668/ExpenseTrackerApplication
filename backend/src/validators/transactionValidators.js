const { z } = require('zod');

const transactionSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(1, 'Title is required')
    .max(100, 'Title must not exceed 100 characters')
    .trim(),
  amount: z
    .number({ required_error: 'Amount is required', invalid_type_error: 'Amount must be a number' })
    .positive('Amount must be greater than 0')
    .multipleOf(0.01, 'Amount can have at most 2 decimal places'),
  type: z.enum(['INCOME', 'EXPENSE'], {
    required_error: 'Transaction type is required',
    invalid_type_error: 'Type must be either INCOME or EXPENSE',
  }),
  categoryId: z
    .string({ required_error: 'Category is required' })
    .min(1, 'Category is required'),
  transactionDate: z
    .string({ required_error: 'Transaction date is required' })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    }),
});

const updateTransactionSchema = transactionSchema.partial();

const transactionQuerySchema = z.object({
  search: z.string().optional(),
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  categoryId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

module.exports = { transactionSchema, updateTransactionSchema, transactionQuerySchema };
