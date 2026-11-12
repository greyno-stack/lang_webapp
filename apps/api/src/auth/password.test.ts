import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from './password.js';

describe('password hashing', () => {
  it('does not return the plain password', async () => {
    const hash = await hashPassword('correct horse');
    expect(hash).not.toBe('correct horse');
  });

  it('accepts the right password', async () => {
    const hash = await hashPassword('correct horse');
    expect(await verifyPassword('correct horse', hash)).toBe(true);
  });

  it('rejects a wrong password', async () => {
    const hash = await hashPassword('correct horse');
    expect(await verifyPassword('wrong horse', hash)).toBe(false);
  });

  it('gives different hashes for the same password (salt)', async () => {
    expect(await hashPassword('same')).not.toBe(await hashPassword('same'));
  });
});
