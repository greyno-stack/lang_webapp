import { Router } from 'express';
import {
  signupRequestSchema,
  type SignupResponse,
  loginRequestSchema,
  type LoginResponse,
} from '@app/shared';
import { prisma } from '../db.js';
import { Prisma } from '../generated/prisma/client.js';
import { hashPassword, verifyPassword } from './password.js';
import { setAuthCookie } from './token.js';

// The columns that are safe to send to the browser. Reused by login and /me later.
export const publicUserSelect = {
  id: true,
  email: true,
  role: true,
  xp: true,
  level: true,
} as const;

export const authRouter = Router();

authRouter.post('/login', async (req, res) => {
  const body = loginRequestSchema.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: 'Invalid credentials', issues: body.error.issues });
    return;
  }

  const { email, password } = body.data;

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      ...publicUserSelect,
      passwordHash: true,
    },
  });

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const { passwordHash, ...publicUser } = user;
  const response: LoginResponse = { user: publicUser };
  setAuthCookie(res, publicUser);
  res.status(200).json(response);
});

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
    setAuthCookie(res, user);
    res.status(201).json(response);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      res.status(409).json({ error: 'Email is already registered' });
      return;
    }
    throw err; // anything else is a real bug: let Express turn it into a 500
  }
});
