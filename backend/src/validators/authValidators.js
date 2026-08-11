const { z } = require('zod');

const registerSchema = z
  .object({
    fullName: z
      .string({ required_error: 'Full name is required' })
      .min(2, 'Full name must be at least 2 characters')
      .max(100, 'Full name must not exceed 100 characters')
      .trim(),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Please enter a valid email address')
      .toLowerCase()
      .trim(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string({ required_error: 'Please confirm your password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required'),
});

module.exports = { registerSchema, loginSchema };
