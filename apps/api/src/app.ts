import express from 'express';
import type { HealthResponse } from '@app/shared';
import { prisma } from './db.js';

// Building the app separately from listen() lets tests import it without opening a port.
export function createApp() {
  const app = express();
  app.use(express.json());

  app.get('/api/health', async (_req, res) => {
    let database: HealthResponse['database'] = 'up';
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      database = 'down';
    }

    const body: HealthResponse = {
      status: database === 'up' ? 'ok' : 'degraded',
      database,
      timestamp: new Date().toISOString(),
    };
    res.status(database === 'up' ? 200 : 503).json(body);
  });

  return app;
}
