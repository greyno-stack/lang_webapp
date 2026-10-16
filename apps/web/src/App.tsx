import { useEffect, useState } from 'react';
import { healthResponseSchema, type HealthResponse } from '@app/shared';

type HealthState =
  { kind: 'loading' } | { kind: 'ok'; data: HealthResponse } | { kind: 'error'; message: string };

async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch('/api/health');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  // Validate at the boundary: if the API ever drifts from the shared schema, this throws.
  return healthResponseSchema.parse(await res.json());
}

export function App() {
  const [health, setHealth] = useState<HealthState>({ kind: 'loading' });

  useEffect(() => {
    fetchHealth()
      .then((data) => setHealth({ kind: 'ok', data }))
      .catch((err: unknown) =>
        setHealth({ kind: 'error', message: err instanceof Error ? err.message : String(err) }),
      );
  }, []);

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <h1>Tagalog Learning App</h1>
      {health.kind === 'loading' && <p>Checking API...</p>}
      {health.kind === 'ok' && (
        <p>
          API status: <strong>{health.data.status}</strong> at {health.data.timestamp}
        </p>
      )}
      {health.kind === 'error' && <p>API unreachable: {health.message}</p>}
    </main>
  );
}
