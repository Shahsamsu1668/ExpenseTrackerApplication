const { z } = require('zod');

const expenseTargetSchema = z.object({
  amount: z.number().positive('Amount must be greater than zero'),
  period: z.string().optional().default('MONTHLY'),
});

module.exports = {
  expenseTargetSchema,
};
