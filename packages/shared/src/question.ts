import { z } from 'zod';

export const questionTypeSchema = z.enum(['VOCABULARY', 'TRANSLATION']);
export type QuestionType = z.infer<typeof questionTypeSchema>;

export const levelSchema = z.number().int().min(1).max(6);

const answerTextSchema = z.string().trim().min(1);

export const questionInputSchema = z.object({
  level: levelSchema,
  type: questionTypeSchema,
  tagalog: answerTextSchema,
  english: answerTextSchema,
  tagalogAlternates: z.array(answerTextSchema).default([]),
  englishAlternates: z.array(answerTextSchema).default([]),
  xpReward: z.number().int().positive().default(10),
});

export type QuestionInput = z.input<typeof questionInputSchema>;
export type QuestionContent = z.output<typeof questionInputSchema>;
