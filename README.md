# Kanban Board

A full-stack **Kanban Board** application inspired by Trello, built with **React, TypeScript, Express.js, PostgreSQL, and Prisma**.

---

## Features

- JWT authentication (access + refresh tokens)
- Boards, columns, and tasks with drag-and-drop reordering (`@dnd-kit`)
- Task details: priority, due dates, checklists, comments, attachments, labels
- Board membership and roles (owner / admin / member)
- Dashboard with stats and recent activity
- Centralized error handling, request logging, and rate limiting on the API

---

## Tech Stack

### Frontend
- React 18 (Vite) + TypeScript
- Tailwind CSS
- React Router
- Axios
- React Hook Form + Zod
- @dnd-kit

### Backend
- Node.js + Express.js
- PostgreSQL + Prisma ORM
- JWT authentication, bcrypt password hashing
- Helmet, CORS, Morgan

---

## Project Structure

```text
kanban-board/
├── client/     # React + Vite frontend
├── server/     # Express + Prisma API
└── README.md
```

---

## Prerequisites

- Node.js 18+
- A running PostgreSQL instance (local or hosted)

---

## Getting Started

```bash
git clone https://github.com/abhi-git06/kanban-board.git
cd kanban-board
```

### 1. Backend (`server/`)

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` and set at minimum:
- `DATABASE_URL` — your PostgreSQL connection string
- `JWT_SECRET` and `JWT_REFRESH_SECRET` — each must be at least 32 characters long

Then set up the database and start the API:

```bash
npm run db:generate   # generate the Prisma client
npm run db:migrate    # create tables from prisma/schema.prisma
npm run db:seed       # optional: seed sample users/boards/tasks
npm run dev           # starts the API on http://localhost:5000
```

### 2. Frontend (`client/`)

In a second terminal:

```bash
cd client
npm install
cp .env.example .env
npm run dev            # starts the app on http://localhost:3000
```

The Vite dev server proxies `/api` requests to `http://localhost:5000`, so both servers need to be running.

### 3. Open the app

Visit `http://localhost:3000` in your browser. If you ran `db:seed`, check `server/prisma/seed.ts` for the sample login credentials it creates.

---

## Environment Variables

**Client** (`client/.env`)
- `VITE_API_URL` — base URL of the API (defaults to `http://localhost:5000/api`)

**Server** (`server/.env`)
- `NODE_ENV`, `PORT`
- `DATABASE_URL`
- `JWT_SECRET`, `JWT_REFRESH_SECRET`, `JWT_ACCESS_EXPIRATION`, `JWT_REFRESH_EXPIRATION`
- `CORS_ORIGIN`
- `LOG_LEVEL`

---

## Useful Scripts

| Location | Script | Description |
|---|---|---|
| `server` | `npm run dev` | Start API with hot reload (nodemon + ts-node) |
| `server` | `npm run build` / `npm start` | Compile to `dist/` and run the compiled server |
| `server` | `npm run db:studio` | Open Prisma Studio to browse the database |
| `client` | `npm run dev` | Start the Vite dev server |
| `client` | `npm run build` | Type-check and build for production |

---

## Fixes Applied

A pass over the codebase turned up a few issues that would have broken a fresh checkout; these are now fixed:

- **`client/src/components/common/Modal.tsx` was an empty file.** Three screens (`BoardPage`, `CreateBoardModal`, `TaskDetailModal`, `BoardSettingsPage`, `DashboardPage`) imported and rendered it, so nothing using a modal would have worked. Implemented it as an accessible, portal-based dialog matching the `isOpen` / `onClose` / `title` / `description` / `footer` / `size` API the rest of the app already expected.
- **CORS middleware was never actually applied.** `server/src/app.ts` called `app.use(corsOptions)`, passing a plain options object where Express expects a middleware function — this throws at startup. Fixed to `app.use(cors(corsOptions))`.
- **Prisma schema type mismatch.** `Column.id` was declared as an autoincrementing `Int`, while every foreign key referencing it (`Task.columnId`, seed data, repositories, validators) used `String` UUIDs. This would fail `prisma generate`/`migrate`. Changed `Column.id` to a `String @default(uuid())` to match the rest of the schema.
- **Column reorder validator used the wrong type.** `reorderColumnsSchema` validated `columnId` as an integer, but column IDs are UUID strings everywhere else in the app — this would have rejected every real reorder request. Fixed to `z.string()`.
- **Missing `nodemon` config.** `npm run dev` in `server/` runs `nodemon src/server.ts`, but with no config nodemon tries to execute the TypeScript file directly with plain Node and fails. Added `server/nodemon.json` so it runs through `ts-node`.

---

## Roadmap

- [x] Project scaffolding (frontend, backend, Prisma schema)
- [x] Authentication, boards, columns, tasks, dashboard
- [ ] Real-time collaboration
- [ ] Notifications
- [ ] Calendar view / dark mode

## License

MIT
