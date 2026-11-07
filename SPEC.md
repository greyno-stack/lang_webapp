# Second Project: Tagalog Learning Web App (working title TBD)

## Project description

A web application for learning Tagalog, organized as a progression system. Users create
accounts and earn experience points (XP) by answering questions, which moves them up
through 6 levels of proficiency based on the CEFR scale. There's no official Tagalog
equivalent of HSK (Mandarin) or JLPT (Japanese), so CEFR is the framework.

The app pulls from a large database of questions, each tagged to a level. The main menu is
a grid of clickable cards that unlock as the user becomes more proficient. Each user's
progress is saved separately.

This is a resume-quality full-stack project, and the main learning goal is TypeScript on
both the frontend and the backend. We are still in the planning phase: no code has been
written yet. Keep maintaining and updating this spec sheet as decisions are made.

---

## Goals

- Resume-quality full-stack project
- Primary learning goal: TypeScript (frontend + backend)

## Platform

- Web application (not mobile)
- TypeScript across the whole stack

## Tech stack (CONFIRMED)

### Monorepo (pnpm workspaces)

- apps/web: frontend
- apps/api: backend REST API
- packages/shared: shared TS types + Zod schemas used by both apps

### Frontend (apps/web)

- React + Vite + TypeScript
- Tailwind CSS
- TanStack Query (React Query) for fetching and caching API data
- React Router for page routing

### Backend (apps/api)

- Node.js + Express + TypeScript
- Zod for request validation
- Auth: JWT stored in httpOnly cookies, bcrypt password hashing
- Auth middleware protecting routes
- Role-based access: learner, admin

### Database

- PostgreSQL
- Prisma ORM (schema, migrations, typed queries)

### Tooling / DevOps

- ESLint + Prettier
- Vitest (unit tests), Playwright (E2E tests)
- Docker Compose for local Postgres (later the full app)
- GitHub Actions CI: lint, type-check, and test on every push
- Deployment: API + DB on Render or Railway; frontend on Vercel or Netlify

### Why this stack (vs. alternatives considered)

- Chosen over Next.js full-stack, NestJS, and the T3 stack
- A separate Express API teaches REST design, HTTP, middleware, CORS and auth from scratch
- Clearer separation of concerns, which is easier to explain in interviews
- The API could later serve a mobile app
- Builds on the user's existing React (React Native) + Node experience

## Proficiency system

- 6 levels mapped to CEFR:
  - L1: A1 Beginner (greetings, numbers, ako/ikaw, basic ang/ng/sa)
  - L2: A2 Elementary (daily routines, may/mayroon, simple verb aspects)
  - L3: B1 Intermediate (verb focus: -um-, mag-, -in, i-; telling stories)
  - L4: B2 Upper Intermediate (linkers na/-ng, complex sentences, opinions)
  - L5: C1 Advanced (idioms, formal vs. casual register, news/reading)
  - L6: C2 Mastery (literature, malalim na Tagalog, cultural nuance)
- Users progress by earning XP through tiers/levels

## Users

- User accounts (sign up / log in)
- Per-user progression (current level, XP, completed content)
- Roles: learner, admin (admins manage the question bank)

## Content / database

- Large question bank
- Each question tagged to a proficiency level (and later a sub-tier/unit)

## Question types (DECIDED 2026-10-21)

Two typed-answer question types. No multiple choice.

- **Vocabulary**: the user sees a single word and types its meaning.
  Example: `kumain` → "ate" / "eat"
- **Translation**: the user sees a full sentence and types its translation.
  Example: `Kumain ako ng kanin.` → "I ate rice."

Every question is **invertible**. Each one stores both a Tagalog side and an English side,
so it can be asked in either direction:

- Tagalog → English (the default): show the Tagalog, the user types English
- English → Tagalog: show the English, the user types Tagalog
- Users pick the direction in their settings (built later, in Phase 6). Until then,
  everything is Tagalog → English.

Data per question: `tagalog` and `english` (the main forms) plus `tagalogAlternates` and
`englishAlternates` (other accepted answers, e.g. "ate" / "eat" / "have eaten").
Both types use the same fields, so they're regular columns rather than JSON.

Answer checking (server-side only; the browser never receives the answers):

- Normalize before comparing: lowercase, trim, collapse spaces, ignore final punctuation
- Correct if the normalized response matches the main form or any alternate
- Store what the user typed (`UserAnswer.response`) so wrong answers can be reviewed, and
  missing valid alternates can be spotted and added

## UI

- Main menu: grid of clickable cards
- Cards unlock progressively as proficiency increases

## Example request flow (submitting an answer)

POST /api/answers
→ auth middleware (identify the user from the cookie)
→ Zod validation of the request body
→ Prisma looks up the question/answer in Postgres
→ score the answer and award XP
→ check for unlocks
→ respond { correct, xp, unlocked }
→ React Query updates the UI and the new card unlocks

## Resume extras (proposed)

- Spaced repetition review using the SM-2 algorithm
- Admin panel for managing questions
- README with live demo link, architecture diagram, screenshots

## Open questions (to decide next)

- How lenient should translation checking be? Sentences have many valid translations.
  Start with exact match against alternates; later options: typo tolerance (edit distance),
  ignoring articles, or AI-assisted grading
- Tagalog-side normalization for English → Tagalog: ignore accent marks? Accept common
  spelling variants?
- XP rules and unlock thresholds (e.g. should Translation give more XP than Vocabulary?)
- Sub-tiers/units within each level?
- Content source: hand-written, AI-generated + human-reviewed, or imported?

---

## Build roadmap

Principle: build in thin vertical slices (DB → API → UI for one feature at a time), keep
the app runnable after every step, and deploy early.

How to use this list:

- Each step is small enough to build, check and commit on its own (one step ≈ one commit).
- Steps are numbered (e.g. 1.3) so they can be referred to in discussion.
- Add, remove, reorder or reword steps freely; this is a plan, not a contract.
- `[x]` = done, `[ ]` = not started. Later phases are less detailed and get broken down
  further when we reach them.

### Phase 0: Repo foundation ✅

- [x] 0.1 pnpm workspace + root scripts (`dev`, `build`, `lint`, `typecheck`, `format`)
- [x] 0.2 Shared strict `tsconfig.base.json`
- [x] 0.3 `packages/shared` with the first Zod schema (`healthResponseSchema`)
- [x] 0.4 `apps/api`: Express `GET /api/health` (tsx for dev, tsup for build)
- [x] 0.5 `apps/web`: Vite + React page that calls the health endpoint through the dev proxy
- [x] 0.6 ESLint (type-aware) + Prettier
- [x] 0.7 GitHub Actions CI: format check, lint, type-check, build
- [x] 0.8 Move the project out of OneDrive to `C:\dev\lang_app`
- [x] 0.9 Public GitHub repo (`greyno-stack/lang_webapp`), first push
- [x] 0.10 CI green on GitHub (README encoding fix pushed)

Decisions made:

- Package scope `@app/*` (`@app/shared`, `@app/api`, `@app/web`); rename once the title is set
- ESM everywhere, `moduleResolution: "Bundler"`, strict TS + `noUncheckedIndexedAccess`
- `@app/shared` ships raw `.ts` (no build step); Vite compiles it for web, tsup bundles it
  into the API build, tsx runs it in API dev
- Dev: Vite proxies `/api` to Express on :3000, so there's no CORS in development
- ESLint 9 flat config with type-aware typescript-eslint rules
- Tailwind, React Router and React Query are deferred until the steps that need them

### Phase 1: Database

Goal: a real PostgreSQL database running locally, with tables defined in code and some
starter questions in it. The API can read from it.

- [x] 1.1 Install Docker Desktop (with WSL 2) and confirm `docker compose version` works
- [x] 1.2 `docker-compose.yml` at the root that runs Postgres, with a named volume so data
      survives restarts; root scripts `db:up` / `db:down`
- [x] 1.3 `.env.example` (committed, no real secrets) + `.env` (gitignored) holding
      `DATABASE_URL`
- [x] 1.4 Add Prisma to `apps/api` (`prisma` + `@prisma/client`), `prisma.config.ts`,
      empty `schema.prisma` pointing at `DATABASE_URL`
- [x] 1.5 First models in `schema.prisma`: `User` (email, passwordHash, role, xp, level,
      timestamps) and a `Role` enum (`LEARNER`, `ADMIN`)
- [x] 1.6 `Question` model: level (1–6), type, `tagalog`, `english`, alternates for each,
      XP reward, timestamps; `QuestionType` enum (`VOCABULARY`, `TRANSLATION`)
- [x] 1.7 `UserAnswer` model (who answered what, what they typed, correct or not, XP
      earned, when) to record progress
- [x] 1.8 First migration (`prisma migrate dev`), look at the generated SQL to learn what
      Prisma does
- [x] 1.9 Zod schema for question content in `packages/shared` (level 1–6, type, non-empty
      `tagalog`/`english`, alternates); reused later by the admin panel
- [x] 1.10 Seed script: ~20 hand-written A1 questions (mostly Vocabulary, a few simple
      Translation), validated with the Zod schema before insert; root script `db:seed`
- [ ] 1.11 Prisma client module in the API (one shared instance) + `/api/health` reports
      whether the database is reachable
- [ ] 1.12 Read-only endpoint `GET /api/questions?level=1` that returns questions without
      their answers (temporary, to prove the DB → API → web path)
- [x] 1.13 CI: generate the Prisma client and run `prisma validate` so schema mistakes fail
      the build
- [ ] 1.14 README "Getting started" section: clone → `pnpm install` → `db:up` → migrate →
      seed → `pnpm dev`; test it from a clean clone

Done when: someone can clone the repo, follow the README, and see seeded questions come
back from the API.

Decisions made:

- Postgres 17 in Docker Compose; local-only credentials in `docker-compose.yml` and
  `apps/api/.env` (`.env.example` committed as the template)
- Prisma pinned to `^7.10.1` (npm `latest` points at a Prisma 8 release candidate)
- Prisma 7 setup: `prisma-client` generator writing to `apps/api/src/generated/prisma`
  (gitignored, Prettier- and ESLint-ignored); DB URL in `prisma.config.ts` via `dotenv`
- Files created by hand instead of `prisma init` (init adds AI-assistant folders we don't want)
- IDs are `cuid()` strings; levels are integers 1–6 (easy to compare for unlocks)
- Questions store both languages as plain columns (`tagalog`, `english`) plus `String[]`
  alternates (Postgres arrays). This replaced an earlier JSON `payload`/`answer` design that
  was planned for multiple choice
- `UserAnswer.response` stores what the user typed
- Prisma 7 connects through the `@prisma/adapter-pg` driver adapter; the API has one shared
  client in `apps/api/src/db.ts`
- API dev script is `node --watch --import tsx src/index.ts`: `tsx watch` hung on Windows
  under `pnpm --parallel` (the root `pnpm dev`) once the API imported Prisma
- `/api/health` returns `database: 'up' | 'down'`, with HTTP 503 when the database is down

### Phase 2: Auth

- [ ] 2.1 Shared Zod schemas: signup and login request bodies
- [ ] 2.2 Password hashing helper (bcrypt) + unit tests (Vitest set up here)
- [ ] 2.3 `POST /api/auth/signup`: validate, hash, create user
- [ ] 2.4 `POST /api/auth/login`: verify password, set JWT in an httpOnly cookie
- [ ] 2.5 Auth middleware: read the cookie, verify the JWT, attach the user to the request
- [ ] 2.6 `GET /api/me` and `POST /api/auth/logout`
- [ ] 2.7 Role middleware (`requireRole('ADMIN')`)
- [ ] 2.8 API route tests for signup/login/me (Supertest + a test database); add tests to CI
- [ ] 2.9 Web: add React Router and React Query
- [ ] 2.10 Web: signup and login pages
- [ ] 2.11 Web: `useMe()` hook, protected routes, logout button

Done when: a user can sign up, refresh the page, and still be logged in.

### Phase 3: Core quiz loop (Tagalog → English)

- [ ] 3.1 Shared schemas: question as sent to the client (Tagalog side only, no answers),
      answer submission (question ID + typed text), answer result
- [ ] 3.2 Answer-checking function (normalize + match against main form and alternates),
      with unit tests covering case, spacing, punctuation and alternates
- [ ] 3.3 `GET /api/questions` for the user's level (never includes the English side)
- [ ] 3.4 `POST /api/answers`: check on the server, record `UserAnswer` (with the
      response), award XP
- [ ] 3.5 Web: add Tailwind
- [ ] 3.6 Web: quiz page showing one question at a time with a text input
- [ ] 3.7 Web: feedback after each answer (correct/incorrect, the expected answer, XP gained)
- [ ] 3.8 Web: XP shown in the header, updated after each answer

Done when: a logged-in user can answer A1 questions and their XP persists.

### Phase 4: Progression + main menu (MVP)

- [ ] 4.1 Decide XP rules and unlock thresholds (record them in this spec)
- [ ] 4.2 Pure functions for level-up and unlocks, with unit tests
- [ ] 4.3 Apply level-up in `POST /api/answers`; response includes `unlocked`
- [ ] 4.4 `GET /api/progress` (level, XP, XP to next level, unlocked cards)
- [ ] 4.5 Web: card-grid main menu with locked/unlocked states
- [ ] 4.6 Web: level-up/unlock feedback when a card unlocks

Done when: earning enough XP visibly unlocks the next card. This is the MVP.

### Phase 5: Deploy the MVP

- [ ] 5.1 Production config: env variable checks on startup, CORS, cookie settings
- [ ] 5.2 Hosted Postgres + API on Render or Railway; run migrations on deploy
- [ ] 5.3 Frontend on Vercel or Netlify
- [ ] 5.4 Solve cross-site cookies (SameSite=None; Secure + CORS credentials, or proxy
      `/api` through the frontend host)
- [ ] 5.5 Continuous deployment: deploy only after CI passes on `main`
- [ ] 5.6 Seed production with starter questions; smoke-test the live site

Done when: a live URL works end to end.

### Phase 6: Question direction (Tagalog ↔ English)

- [ ] 6.1 `Direction` enum (`TL_TO_EN`, `EN_TO_TL`) + user setting `questionDirection`
      (default `TL_TO_EN`); migration
- [ ] 6.2 Record the direction on each `UserAnswer`
- [ ] 6.3 API: show the side matching the user's direction and check against the other side
- [ ] 6.4 Tagalog-side answer checking (accent marks, spelling variants) with tests
- [ ] 6.5 Web: settings page with the direction toggle

Ideas for later question types (not planned): fill-in-the-blank, listening (audio/TTS),
sentence building (word tiles), matching pairs.

### Phase 7: Admin panel

- [ ] 7.1 Admin-only routes (API + web)
- [ ] 7.2 Question list with filters (level, type)
- [ ] 7.3 Create/edit/delete questions with validation per question type

### Phase 8: Content growth

- [ ] 8.1 Decide on sub-tiers/units within levels and the content source
- [ ] 8.2 Units in the schema and the main menu
- [ ] 8.3 Expand the question bank across all levels

### Phase 9: Spaced repetition (SM-2)

- [ ] 9.1 SM-2 scheduling as a pure, tested function
- [ ] 9.2 Per-user review schedule stored in the DB
- [ ] 9.3 Review queue page

### Phase 10: Polish for resume

- [ ] 10.1 Playwright E2E test: signup → quiz → unlock, run in CI
- [ ] 10.2 README: live demo link, demo account, architecture diagram, screenshots
- [ ] 10.3 Optional: Dockerize the full app

## Next step

Phase 1, step 1.11: a shared Prisma client module in the API, and `/api/health` reporting
whether the database is reachable. (1.13 was done early, because the seed script was the
first code to import the generated client.) Choosing a direction is deferred
to Phase 6; until then, questions are asked Tagalog → English.
