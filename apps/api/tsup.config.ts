import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node22',
  clean: true,
  // @app/shared ships raw TypeScript, so bundle it into the output instead of importing at runtime.
  noExternal: ['@app/shared'],
});
