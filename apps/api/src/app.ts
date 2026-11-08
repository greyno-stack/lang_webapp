import express from 'express';
import { prisma } from './db.js';
import {
  questionListQuerySchema,
  type HealthResponse,
  type QuestionListResponse,
} from '@app/shared';

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

  app.get('/api/questions', async (req, res) => {
    const query = questionListQuerySchema.safeParse(req.query);
    if (!query.success) {
      res.status(400).json({ error: 'Invalid query', issues: query.error.issues });
      return;
    }

    const questions = await prisma.question.findMany({
      where: { level: query.data.level },
      select: { id: true, level: true, type: true, tagalog: true },
      orderBy: { createdAt: 'asc' },
    });

    const body: QuestionListResponse = { questions };
    res.json(body);
  });

  return app;
}
