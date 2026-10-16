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

- Question types: multiple choice, typed translation, fill-in-the-blank,
  listening (audio/TTS), sentence building (word tiles), matching pairs?
  - Proposed: MVP ships multiple choice only. Schema stores a `type` discriminator plus a
    JSON payload validated by a Zod discriminated union in packages/shared, so new types
    can be added later without a migration per type.
- XP rules and unlock thresholds
- Sub-tiers/units within each level?
- Content source: hand-written, AI-generated + human-reviewed, or imported?

---

## Build roadmap (proposed)

Principle: build in thin vertical slices (DB → API → UI for one feature at a time), keep
the app runnable after every phase, and deploy early. Each phase ends with a commit/PR.

### Phase 0: Repo foundation

- git + GitHub repo, pnpm workspace, shared base tsconfig (strict mode)
- apps/api: Express "GET /api/health"; apps/web: Vite React page that calls it
- packages/shared wired into both apps (prove a shared type/Zod schema imports cleanly)
- ESLint + Prettier, GitHub Actions running lint + type-check
- Done when: one command runs both apps locally and CI is green
- Status (2026-10-16): built and verified locally (`pnpm dev`, lint, type-check, build all
  pass). Remaining: first commit, push to GitHub, confirm CI is green.
- Decisions made:
  - Package scope `@app/*` (`@app/shared`, `@app/api`, `@app/web`); rename once the title is set
  - ESM everywhere, `moduleResolution: "Bundler"`, strict TS + `noUncheckedIndexedAccess`
  - `@app/shared` ships raw `.ts` (no build step); Vite compiles it for web, tsup bundles it
    into the API build, tsx runs it in API dev
  - Dev: Vite proxies `/api` to Express on :3000, so there's no CORS in development
  - ESLint 9 flat config with type-aware typescript-eslint rules
  - Tailwind, React Router and React Query are deferred until the phases that need them

### Phase 1: Database

- Docker Compose Postgres, Prisma setup
- Initial schema: User, Question (level, type, payload), UserProgress
- Seed script with ~20 hand-written A1 multiple-choice questions
- Done when: `prisma migrate` + seed works from a clean clone

### Phase 2: Auth (vertical slice)

- API: signup, login, logout, GET /api/me; bcrypt, JWT in httpOnly cookie, auth middleware
- Web: signup/login pages, auth state via React Query (`/me`), protected routes
- Vitest tests for auth routes
- Done when: a user can sign up, refresh the page, and still be logged in

### Phase 3: Core quiz loop (multiple choice only)

- GET questions for a level, POST /api/answers (score server-side, award XP)
- Never send correct answers to the client before submission
- Web: quiz page, feedback after each answer, XP display
- Done when: a logged-in user can answer A1 questions and XP persists

### Phase 4: Progression + main menu

- XP thresholds, level-up and unlock logic (unit-tested pure functions)
- Card-grid main menu with locked/unlocked states
- Done when: earning enough XP visibly unlocks the next card. This is the MVP.

### Phase 5: Deploy the MVP

- API + DB on Render/Railway, frontend on Vercel/Netlify, env vars, prod migrations
- Watch for cross-site cookie issues (frontend and API on different domains): either
  SameSite=None; Secure + CORS credentials, or proxy /api through the frontend host
- Done when: a live URL works end to end

### Phase 6: More question types

- Typed translation, fill-in-the-blank, word tiles, matching (one at a time)
- Add each as a new variant of the Zod discriminated union + a React component

### Phase 7: Admin panel

- Role-based route protection, CRUD for questions with validation

### Phase 8: Content growth

- Sub-tiers/units, expand question bank across levels

### Phase 9: Spaced repetition (SM-2)

- Review queue per user, scheduling stored per user/question

### Phase 10: Polish for resume

- Playwright E2E for signup → quiz → unlock
- README: live demo link, demo account, architecture diagram, screenshots
- Optional: Dockerize the full app

## Next step

Finish Phase 0 (commit, push to GitHub, green CI), then Phase 1 (Docker Compose Postgres +
Prisma). Question-type decision can be deferred: MVP uses multiple choice, with the schema
designed to add more types later.
