# lang_webapp

A web app for learning Tagalog. Answer vocabulary and translation questions, earn XP, and
level up from A1 to C2 to unlock new content.

Built with TypeScript across the stack: React + Vite, Express, Prisma + PostgreSQL, and Zod
schemas shared between the frontend and backend in a pnpm monorepo.

## Prerequisites

- [Node.js](https://nodejs.org/) 22 (see `.nvmrc`)
- [pnpm](https://pnpm.io/) 10: `npm install -g pnpm`
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (runs the local database)

## Getting started

1. Clone the repo and install dependencies:

   ```bash
   git clone https://github.com/greyno-stack/lang_webapp.git
   cd lang_webapp
   pnpm install
   ```

2. Create the API's environment file from the example:

   ```bash
   # macOS / Linux
   cp apps/api/.env.example apps/api/.env
   # Windows
   copy apps\api\.env.example apps\api\.env
   ```

3. Start Docker Desktop, then start the database:

   ```bash
   pnpm db:up
   ```

4. Generate the Prisma client, create the tables and add the starter questions:

   ```bash
   pnpm db:generate
   pnpm db:migrate
   pnpm db:seed
   ```

5. Start the API and the web app:

   ```bash
   pnpm dev
   ```

   Open http://localhost:5173. The page should show `database: up` and a list of level 1
   questions. The API runs at http://localhost:3000 (try `/api/health`).

## Useful scripts

Run these from the repo root.

| Script             | What it does                                                      |
| ------------------ | ----------------------------------------------------------------- |
| `pnpm dev`         | Run the API and web app with live reload                          |
| `pnpm check`       | Format check, lint, typecheck and build (the same checks CI runs) |
| `pnpm format`      | Fix formatting                                                    |
| `pnpm db:up`       | Start the Postgres container                                      |
| `pnpm db:down`     | Stop it (your data is kept)                                       |
| `pnpm db:generate` | Regenerate the Prisma client after changing the schema            |
| `pnpm db:migrate`  | Apply database migrations                                         |
| `pnpm db:seed`     | Reset and refill the starter questions                            |

## Project structure

```
apps/api         Express API, Prisma schema, migrations and seed
apps/web         React + Vite frontend
packages/shared  Zod schemas and types used by both apps
```
