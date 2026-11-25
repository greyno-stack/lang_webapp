import { type RequestHandler } from 'express';
import { verifyToken, AUTH_COOKIE, type AuthUser } from './token.js';

export const requireAuth: RequestHandler = (req, res, next) => {
  const cookies = req.cookies as Record<string, unknown>;
  const token = cookies[AUTH_COOKIE];
  let user: AuthUser | null;

  if (typeof token === 'string') {
    user = verifyToken(token);
  } else {
    user = null;
  }

  if (!user) {
    res.status(401).json({ error: 'Unauthorized user' });
    return;
  }

  req.user = user;
  next();
};
