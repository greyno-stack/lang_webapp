import 'dotenv/config';
import { prisma } from '../src/db.js';
import { questionInputSchema, type QuestionInput } from '@app/shared';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const questions: QuestionInput[] = [
  // Vocabulary
  { level: 1, type: 'VOCABULARY', tagalog: 'bahay', english: 'house', englishAlternates: ['home'] },
  { level: 1, type: 'VOCABULARY', tagalog: 'tubig', english: 'water' },
  { level: 1, type: 'VOCABULARY', tagalog: 'aso', english: 'dog' },
  { level: 1, type: 'VOCABULARY', tagalog: 'pusa', english: 'cat' },
  { level: 1, type: 'VOCABULARY', tagalog: 'pagkain', english: 'food' },
  { level: 1, type: 'VOCABULARY', tagalog: 'kaibigan', english: 'friend' },
  { level: 1, type: 'VOCABULARY', tagalog: 'pamilya', english: 'family' },
  {
    level: 1,
    type: 'VOCABULARY',
    tagalog: 'paaralan',
    english: 'school',
    tagalogAlternates: ['eskwelahan'],
  },
  { level: 1, type: 'VOCABULARY', tagalog: 'libro', english: 'book', tagalogAlternates: ['aklat'] },
  { level: 1, type: 'VOCABULARY', tagalog: 'araw', english: 'day', englishAlternates: ['sun'] },
  {
    level: 1,
    type: 'VOCABULARY',
    tagalog: 'gabi',
    english: 'night',
    englishAlternates: ['evening'],
  },
  { level: 1, type: 'VOCABULARY', tagalog: 'oo', english: 'yes' },
  { level: 1, type: 'VOCABULARY', tagalog: 'hindi', english: 'no', englishAlternates: ['not'] },
  {
    level: 1,
    type: 'VOCABULARY',
    tagalog: 'salamat',
    english: 'thank you',
    englishAlternates: ['thanks'],
  },
  {
    level: 1,
    type: 'VOCABULARY',
    tagalog: 'maganda',
    english: 'beautiful',
    englishAlternates: ['pretty'],
  },
  { level: 1, type: 'VOCABULARY', tagalog: 'malaki', english: 'big', englishAlternates: ['large'] },
  // Translation
  { level: 1, type: 'TRANSLATION', tagalog: 'Magandang umaga.', english: 'Good morning.' },
  { level: 1, type: 'TRANSLATION', tagalog: 'Kumusta ka?', english: 'How are you?' },
  {
    level: 1,
    type: 'TRANSLATION',
    tagalog: 'Ako si Maria.',
    english: 'I am Maria.',
    englishAlternates: ["I'm Maria."],
  },
  {
    level: 1,
    type: 'TRANSLATION',
    tagalog: 'Salamat po.',
    english: 'Thank you.',
    englishAlternates: ['Thanks.'],
  },
];

// Validate everything first, so bad data stops the script before anything is deleted
const data = questions.map((question) => questionInputSchema.parse(question));

try {
  await prisma.question.deleteMany();
  const result = await prisma.question.createMany({ data });
  console.log(`Seeded ${result.count} questions`);
} finally {
  await prisma.$disconnect();
}
