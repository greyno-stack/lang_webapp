import { z } from 'zod';

// The schema is the single source of truth: the API builds responses that satisfy it,
// and the web app parses responses with it.
export const healthResponseSchema = z.object({
  status: z.literal('ok'),
  timestamp: z.iso.datetime(),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;
