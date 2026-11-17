import { Router } from 'express';
import { signupRequestSchema, type SignupResponse } from '@app/shared';
import { prisma } from '../db.js';
import { Prisma } from '../generated/prisma/client.js';
import { hashPassword } from './password.js';

// The columns that are safe to send to the browser. Reused by login and /me later.
export const publicUserSelect = {
  id: true,
  email: true,
  role: true,
  xp: true,
  level: true,
} as const;

export const authRouter = Router();

authRouter.post('/signup', async (req, res) => {
  const body = signupRequestSchema.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: 'Invalid signup', issues: body.error.issues });
    return;
  }

  const { email, password } = body.data;

  try {
    const user = await prisma.user.create({
      data: { email, passwordHash: await hashPassword(password) },
      select: publicUserSelect,
    });
    const response: SignupResponse = { user };
    res.status(201).json(response);
  } catch (err) {
    // P2002 = a unique constraint failed; here, User.email
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      res.status(409).json({ error: 'Email is already registered' });
      return;
    }
    throw err; // anything else is a real bug: let Express turn it into a 500
  }
});
