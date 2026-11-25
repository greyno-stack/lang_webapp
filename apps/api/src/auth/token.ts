import jwt from 'jsonwebtoken';
import type { Response } from 'express';
import { roleSchema, type PublicUser } from '@app/shared';
import { z } from 'zod';

const envSecret = process.env.JWT_SECRET;
if (!envSecret) {
  throw new Error('JWT_SECRET is not set');
}

const secret: string = envSecret;

const SESSION_DAYS = 7;
export const AUTH_COOKIE = 'token';

export type AuthUser = Pick<PublicUser, 'id' | 'role'>;

export function signToken(user: AuthUser): string {
  return jwt.sign({ role: user.role }, secret, {
    subject: user.id,
    expiresIn: `${SESSION_DAYS}d`,
  });
}

export function setAuthCookie(res: Response, user: AuthUser): void {
  res.cookie(AUTH_COOKIE, signToken(user), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_DAYS * 24 * 60 * 60 * 1000,
  });
}

const tokenPayloadSchema = z.object({
  sub: z.string(),
  role: roleSchema,
});

export function verifyToken(token: string): AuthUser | null {
  try {
    const payload = tokenPayloadSchema.parse(
      jwt.verify(token, secret, {
        algorithms: ['HS256'],
      }),
    );
    return { id: payload.sub, role: payload.role };
  } catch {
    return null;
  }
}
