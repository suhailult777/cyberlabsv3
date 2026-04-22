import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const planSchema = z.object({
  labId: z.string().min(1, 'Please select a lab'),
  hours: z.number().min(1, 'Minimum 1 hour').max(48, 'Maximum 48 hours'),
});

export const paymentInitiateSchema = z.object({
  planId: z.string().min(1, 'Plan ID is required'),
});

export const paymentVerifySchema = z.object({
  txnId: z.string().min(1, 'Transaction ID is required'),
});

export const provisionSchema = z.object({
  planId: z.string().min(1, 'Plan ID is required'),
});
