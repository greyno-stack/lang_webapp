import type { AuthUser } from '../auth/token.js';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
