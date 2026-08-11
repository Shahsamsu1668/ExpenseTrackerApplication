import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    fullName: z
      .string({ required_error: 'Full name is required' })
      .min(2, 'Full name must be at least 2 characters')
      .max(100, 'Full name must not exceed 100 characters'),
    email: z
      .string({ required_error: 'Email is required' })
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z
      .string({ required_error: 'Please confirm your password' })
      .min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const transactionSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(1, 'Title is required')
    .max(100, 'Title too long'),
  amount: z
    .string({ required_error: 'Amount is required' })
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Amount must be greater than 0',
    }),
  type: z.enum(['INCOME', 'EXPENSE'], {
    required_error: 'Please select a type',
  }),
  categoryId: z
    .string({ required_error: 'Category is required' })
    .min(1, 'Please select a category'),
  transactionDate: z
    .string({ required_error: 'Date is required' })
    .min(1, 'Date is required'),
});

export const categorySchema = z.object({
  name: z
    .string({ required_error: 'Category name is required' })
    .min(1, 'Category name is required')
    .max(50, 'Category name too long'),
  type: z.enum(['INCOME', 'EXPENSE'], {
    required_error: 'Please select a type',
  }),
});
