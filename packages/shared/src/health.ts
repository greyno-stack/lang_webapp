import { z } from 'zod';

// The schema is the single source of truth: the API builds responses that satisfy it,
// and the web app parses responses with it.
export const healthResponseSchema = z.object({
  status: z.enum(['ok', 'degraded']),
  database: z.enum(['up', 'down']),
  timestamp: z.iso.datetime(),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;
