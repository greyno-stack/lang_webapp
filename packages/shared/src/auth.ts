import { z } from 'zod';
import { levelSchema } from './question.js';

const emailSchema = z.string().trim().toLowerCase().pipe(z.email());

export const signupRequestSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters').max(72),
});

export type SignupRequest = z.infer<typeof signupRequestSchema>;

export const loginRequestSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;

export const roleSchema = z.enum(['LEARNER', 'ADMIN']);

export const publicUserSchema = z.object({
  id: z.string(),
  email: emailSchema,
  role: roleSchema,
  xp: z.nonnegative(),
  level: levelSchema,
});

export const signupResponseSchema = z.object({
  user: publicUserSchema,
});

export type PublicUser = z.infer<typeof publicUserSchema>;
export type SignupResponse = z.infer<typeof signupResponseSchema>;
