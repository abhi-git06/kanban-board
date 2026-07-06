# Kanban Board

A production-ready, full-stack **Kanban Board** application inspired by Trello, built with **React, TypeScript, Express.js, PostgreSQL, and Prisma**.

> **Project Status:** 🚧 Actively Under Development

---

## Features

| Feature | Status |
|---------|--------|
| User Authentication (JWT) | 🚧 In Progress |
| Board Management | 🚧 In Progress |
| Column Management | 🚧 In Progress |
| Task Management | 🚧 In Progress |
| Task Details (Comments, Checklist, Labels) | 🚧 In Progress |
| Drag & Drop | ⏳ Planned |
| Dashboard & Analytics | ⏳ Planned |
| Team Collaboration | ⏳ Planned |
| Search & Filters | ⏳ Planned |
| Real-time Collaboration | 🔮 Future |

---

## Preview

Project screenshots and demo GIFs will be added as development progresses.

---

## Tech Stack

### Frontend
- React 18 (Vite)
- TypeScript
- Tailwind CSS
- React Router
- Axios
- React Hook Form
- Zod
- @dnd-kit

### Backend
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication
- bcrypt
- Helmet
- CORS
- Morgan

---

## Project Structure

```text
kanban-board/
├── client/
├── server/
└── README.md
```

## Installation

```bash
git clone https://github.com/abhi-git06/kanban-board.git
cd kanban-board
```

### Frontend

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

### Backend

```bash
cd server
npm install
cp .env.example .env
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

## Environment Variables

Client:
- VITE_API_URL=http://localhost:5000/api

Server:
- PORT
- DATABASE_URL
- JWT_SECRET
- JWT_REFRESH_SECRET
- CORS_ORIGIN

## Roadmap

### Phase 1
- [x] Project setup
- [x] Frontend architecture
- [x] Backend architecture
- [x] Prisma configuration

### Phase 2
- [ ] Authentication
- [ ] Boards
- [ ] Columns
- [ ] Tasks
- [ ] Dashboard

### Phase 3
- [ ] Collaboration
- [ ] Notifications

### Phase 4
- [ ] Real-time Collaboration

## Current Progress

| Module | Status |
|--------|--------|
| Frontend | ✅ Complete |
| Backend Foundation | ✅ Complete |
| API | 🚧 In Progress |
| Database | ✅ Complete |
| UI | 🚧 In Progress |

## Future Improvements

- Calendar View
- Dark Mode
- Email Notifications
- Mobile Optimizations
- Analytics

## License

MIT

Built with ❤️ using React, TypeScript, Express.js, PostgreSQL & Prisma.
