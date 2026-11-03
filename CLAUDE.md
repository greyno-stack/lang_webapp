# CLAUDE.md

Context for Claude Code sessions on this repo. Read this first, then `SPEC.md`.

## Project

A Tagalog learning web app: users answer typed questions (Vocabulary and Translation),
earn XP, and level up through 6 CEFR levels (A1–C2), unlocking content as they go.
It's a resume project, and the main goal is **learning TypeScript across the full stack**.

**`SPEC.md` is the living plan.** It holds the product decisions, the numbered build
checklist (e.g. step 1.6) and what's done. Find the first unchecked step to see where we
are. When a decision is made, record it in `SPEC.md` and tick off finished steps.

## How to work with me (important)

I'm learning, so I build things myself:

- **Guide me step by step; don't write the app code for me** unless I ask. For each step:
  what to do, the code or commands, why it works, and how to check it worked.
- Give a few steps at a time, then wait for me to report back.
- When I ask you to check my work, read the actual files and run the checks; point out
  problems and explain them rather than silently fixing them.
- Explain new concepts in plain language. My background: React Native and plain-JS
  Node/Express (with Prisma) from a previous project. New to CI, Docker and monorepos.
- **I make my own git commits.** Don't commit or push unless I ask.
- Editing `SPEC.md` and docs like this one is fine.

## I work on two machines

A Windows PC (`C:\dev\lang_app`) and a Mac. **GitHub is the only sync between them.**
Uncommitted work and gitignored files (`.env`, generated code, the database) stay on one
machine. At the start of a session, check `git status` and whether we're behind
`origin/main`, and remind me to pull or push if needed.

## Stack and layout

pnpm monorepo, ESM and strict TypeScript everywhere:

- `apps/api`: Express 5 API (tsx in dev, tsup for build), Prisma 7 + PostgreSQL
- `apps/web`: React 19 + Vite (proxies `/api` to the API on port 3000)
- `packages/shared`: Zod schemas and types used by both apps (raw `.ts`, no build step)

Planned (not added yet): Tailwind, React Router, React Query, Vitest, Playwright, JWT auth.

## Commands

From the repo root:

- `pnpm dev`: run the API (localhost:3000) and web app (localhost:5173)
- `pnpm db:up` / `pnpm db:down`: start/stop Postgres in Docker
- Before committing, run the same checks as CI:
  `pnpm format:check && pnpm lint && pnpm typecheck && pnpm build`
- `pnpm format`: fix formatting

From `apps/api`:

- `pnpm exec prisma format | validate | generate`
- `pnpm exec prisma migrate dev`: create/apply migrations

## Gotchas

- **Prisma is pinned to `^7.10.1`.** npm's `latest` tag points at a Prisma 8 release
  candidate, so always install with an explicit version.
- **Don't run `prisma init`.** It adds AI-assistant folders (`.agents`, `.claude`,
  `.windsurf`, `skills-lock.json`) that we don't want.
- The Prisma client is generated into `apps/api/src/generated/prisma`, which is gitignored.
  Run `prisma generate` after cloning or changing the schema.
- The pnpm warning "Ignored build scripts: @prisma/engines, prisma" is safe to ignore.
- `apps/api/.env` is gitignored; copy it from `apps/api/.env.example` on a new machine.
  `DATABASE_URL` must match the user, password and database in `docker-compose.yml`.
- On Windows, don't create files with PowerShell's `echo ... >`: it writes UTF-16, which
  breaks Prettier and CI. Create files in the editor instead.
- Never send question answers to the browser; answers are checked on the server only.
