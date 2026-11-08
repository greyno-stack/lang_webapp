import { useEffect, useState } from 'react';
import { questionListResponseSchema, type QuestionPrompt } from '@app/shared';

type ListState =
  | { kind: 'loading' }
  | { kind: 'ok'; questions: QuestionPrompt[] }
  | { kind: 'error'; message: string };

async function fetchQuestions(level: number): Promise<QuestionPrompt[]> {
  const res = await fetch(`/api/questions?level=${level}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return questionListResponseSchema.parse(await res.json()).questions;
}

export function QuestionList() {
  const [state, setState] = useState<ListState>({ kind: 'loading' });

  useEffect(() => {
    fetchQuestions(1)
      .then((questions) => setState({ kind: 'ok', questions }))
      .catch((err: unknown) =>
        setState({ kind: 'error', message: err instanceof Error ? err.message : String(err) }),
      );
  }, []);

  if (state.kind === 'loading') return <p>Loading questions...</p>;
  if (state.kind === 'error') return <p>Could not load questions: {state.message}</p>;

  return (
    <ul>
      {state.questions.map((q) => (
        <li key={q.id}>
          {q.tagalog} <small>({q.type.toLowerCase()})</small>
        </li>
      ))}
    </ul>
  );
}
