import { describe, expect, it } from 'vitest';
import { signToken, verifyToken } from './token.js';
import jwt from 'jsonwebtoken';

const user = { id: 'user-1', role: 'LEARNER' } as const;

describe('verifyToken', () => {
  it('returns the user for a token we signed', () => {
    expect(verifyToken(signToken(user))).toEqual(user);
  });

  it('rejects a token whose payload was changed', () => {
    const [header, , signature] = signToken(user).split('.');
    const forgedPayload = Buffer.from(JSON.stringify({ sub: 'user-1', role: 'ADMIN' })).toString(
      'base64url',
    );
    expect(verifyToken(`${header}.${forgedPayload}.${signature}`)).toBeNull();
  });

  it('rejects garbage', () => {
    expect(verifyToken('not-a-jwt')).toBeNull();
  });

  it('rejects a token with a different secret', () => {
    const value = jwt.sign({ role: 'LEARNER' }, 'test-secr', { subject: 'user-1' });
    expect(verifyToken(value)).toBeNull();
  });

  it('rejects an expired token', () => {
    const value = jwt.sign(
      { role: 'LEARNER', exp: Math.floor(Date.now() / 1000) - 60 },
      'test-secret',
      { subject: 'user-2' },
    );

    expect(verifyToken(value)).toBeNull();
  });
});
