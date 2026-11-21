import jwt from 'jsonwebtoken';
import type { Response } from 'express';
import type { PublicUser } from '@app/shared';

const envSecret = process.env.JWT_SECRET;
if (!envSecret) {
  throw new Error('JWT_SECRET is not set');
}

const secret: string = envSecret;

const SESSION_DAYS = 7;
export const AUTH_COOKIE = 'token';

export function signToken(user: Pick<PublicUser, 'id' | 'role'>): string {
  return jwt.sign({ role: user.role }, secret, {
    subject: user.id,
    expiresIn: `${SESSION_DAYS}d`,
  });
}

export function setAuthCookie(res: Response, user: Pick<PublicUser, 'id' | 'role'>): void {
  res.cookie(AUTH_COOKIE, signToken(user), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_DAYS * 24 * 60 * 60 * 1000,
  });
}
