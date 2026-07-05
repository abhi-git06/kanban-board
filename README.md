# Kanban Board

A production-ready, full-stack Kanban Board application built for team collaboration. Designed with enterprise-level architecture, type safety, and scalability in mind.

---

## Features

| Feature | Status |
|---------|--------|
| User Authentication (Register / Login / Logout / JWT) | 🟢 Implemented |
| Board Management (Create / Rename / Delete / Archive / Favourite) | 🟢 Implemented |
| Column Management (Add / Rename / Delete / Reorder) | 🟢 Implemented |
| Task Management (CRUD, Priority, Status, Due Date, Labels) | 🟢 Implemented |
| Task Details (Checklist, Comments, Attachments, Activity Log) | 🟢 Implemented |
| Drag & Drop (Columns & Tasks via @dnd-kit) | 🟢 Implemented |
| Dashboard (Stats, Board Grid) | 🟢 Implemented |
| Team Collaboration (Invite Members, Roles & Permissions) | 🟢 Implemented |
| Search & Filters (Task Name, Label, User, Due Today, etc.) | 🔵 Planned |
| Real-time Collaboration (Socket.IO) | 🔵 Planned |

---

## Tech Stack

### Frontend
- **React 18** (Vite)
- **TypeScript**
- **Tailwind CSS**
- **React Router DOM**
- **Axios**
- **@dnd-kit** (Drag & Drop)
- **React Hook Form**
- **Zod** (Validation)

### Backend
- **Node.js**
- **Express.js**
- **PostgreSQL**
- **Prisma ORM**
- **JWT Authentication**
- **bcrypt** (Password hashing)
- **Helmet** (Security headers)
- **CORS**
- **Morgan** (Logging)

---

## Project Structure

```
kanban-board/
│
├── client/                          # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── auth/                # LoginForm, RegisterForm, AuthLayout
│   │   │   ├── board/               # BoardList, BoardCard, CreateBoardModal
│   │   │   ├── column/              # Column, ColumnHeader, AddColumnButton
│   │   │   ├── task/                # TaskCard, TaskDetailModal, TaskForm
│   │   │   ├── dashboard/           # StatsCards, ProductivityChart
│   │   │   ├── common/              # Button, Input, Modal, Dropdown, Avatar, Spinner, EmptyState
│   │   │   └── layout/              # Navbar, Sidebar, MainLayout
│   │   ├── pages/                   # Route-level page components
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── BoardPage.tsx
│   │   │   ├── TaskDetailPage.tsx
│   │   │   ├── BoardSettingsPage.tsx
│   │   │   └── NotFoundPage.tsx
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useBoards.ts
│   │   │   ├── useColumns.ts
│   │   │   ├── useTasks.ts
│   │   │   ├── useDragAndDrop.ts
│   │   │   └── useDebounce.ts
│   │   ├── services/                # API service modules
│   │   │   ├── api.ts
│   │   │   ├── authService.ts
│   │   │   ├── boardService.ts
│   │   │   ├── columnService.ts
│   │   │   ├── taskService.ts
│   │   │   └── userService.ts
│   │   ├── types/                   # TypeScript interfaces
│   │   │   ├── auth.ts
│   │   │   ├── board.ts
│   │   │   ├── column.ts
│   │   │   └── task.ts
│   │   ├── utils/                   # Utility functions
│   │   │   ├── cn.ts
│   │   │   ├── formatDate.ts
│   │   │   └── validators.ts
│   │   ├── context/                 # React Context providers
│   │   │   └── AuthContext.tsx
│   │   ├── constants/               # App constants
│   │   ├── routes/                  # Route definitions
│   │   │   └── AppRoutes.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── .env.example
│
├── server/                          # Node.js Backend
│   ├── prisma/
│   │   ├── schema.prisma            # Database schema
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── src/
│   │   ├── config/                  # App configuration
│   │   │   ├── database.ts
│   │   │   ├── env.ts
│   │   │   └── cors.ts
│   │   ├── controllers/             # Route controllers
│   │   │   ├── authController.ts
│   │   │   ├── boardController.ts
│   │   │   ├── columnController.ts
│   │   │   ├── taskController.ts
│   │   │   ├── userController.ts
│   │   │   └── dashboardController.ts
│   │   ├── services/                # Business logic
│   │   │   ├── authService.ts
│   │   │   ├── boardService.ts
│   │   │   ├── columnService.ts
│   │   │   ├── taskService.ts
│   │   │   ├── userService.ts
│   │   │   └── dashboardService.ts
│   │   ├── repositories/            # Data access layer
│   │   │   ├── userRepository.ts
│   │   │   ├── boardRepository.ts
│   │   │   ├── columnRepository.ts
│   │   │   ├── taskRepository.ts
│   │   │   └── activityRepository.ts
│   │   ├── routes/                  # API routes
│   │   │   ├── authRoutes.ts
│   │   │   ├── boardRoutes.ts
│   │   │   ├── columnRoutes.ts
│   │   │   ├── taskRoutes.ts
│   │   │   ├── userRoutes.ts
│   │   │   └── dashboardRoutes.ts
│   │   ├── middleware/              # Express middleware
│   │   │   ├── authMiddleware.ts
│   │   │   ├── errorHandler.ts
│   │   │   ├── validateRequest.ts
│   │   │   ├── rateLimiter.ts
│   │   │   └── logger.ts
│   │   ├── validators/              # Request validation
│   │   │   ├── authValidator.ts
│   │   │   ├── boardValidator.ts
│   │   │   ├── columnValidator.ts
│   │   │   └── taskValidator.ts
│   │   ├── utils/                   # Backend utilities
│   │   │   ├── jwt.ts
│   │   │   ├── bcrypt.ts
│   │   │   ├── response.ts
│   │   │   └── logger.ts
│   │   ├── types/                   # Shared types
│   │   │   ├── express.d.ts
│   │   │   ├── auth.ts
│   │   │   ├── board.ts
│   │   │   ├── column.ts
│   │   │   └── task.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── .gitignore
│
└── README.md
```

---

## Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Clone & Setup

```bash
git clone <repository-url>
cd kanban-board
```

### Frontend

```bash
cd client
npm install

# Create .env file
cp .env.example .env

npm run dev
```

The frontend will be available at `http://localhost:3000`.

### Backend

```bash
cd server
npm install

# Create .env file and fill in your values
cp .env.example .env

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database (optional)
npm run db:seed

# Start development server
npm run dev
```

The API will be available at `http://localhost:5000`.

---

## Environment Variables

### Client (`client/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

### Server (`server/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment mode (development/production) | Yes |
| `PORT` | Server port | `5000` |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | Access token secret (min 32 chars) | Yes |
| `JWT_REFRESH_SECRET` | Refresh token secret (min 32 chars) | Yes |
| `JWT_ACCESS_EXPIRATION` | Access token TTL | `15m` |
| `JWT_REFRESH_EXPIRATION` | Refresh token TTL | `7d` |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:3000` |
| `LOG_LEVEL` | Logging verbosity | `info` |

---

## Database

The application uses **PostgreSQL** as the primary database with **Prisma ORM** for:
- Type-safe database queries
- Schema migrations
- Database seeding
- Relationship management

### Schema Design Principles
- **Normalization** — Tables follow 3NF to eliminate redundancy
- **Primary Keys** — UUID v4 for all entities
- **Foreign Keys** — Proper references with cascade deletes where appropriate
- **Indexes** — Strategic indexes on frequently queried columns
- **Timestamps** — `createdAt` and `updatedAt` on all tables
- **Enums** — Fixed-value fields use Prisma enum types

### Prisma Commands

```bash
# Generate Prisma client after schema changes
npm run db:generate

# Create and apply a migration
npm run db:migrate

# Deploy migrations in production
npm run db:deploy

# Open Prisma Studio (database GUI)
npm run db:studio

# Seed the database
npm run db:seed
```

---

## API Documentation

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Register new user | No |
| `POST` | `/api/auth/login` | Login user | No |
| `POST` | `/api/auth/logout` | Logout user | Yes |
| `GET` | `/api/auth/me` | Get current user | Yes |
| `POST` | `/api/auth/refresh` | Refresh access token | No |

### Boards

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/boards` | List all boards | Yes |
| `GET` | `/api/boards/:id` | Get board by ID | Yes |
| `POST` | `/api/boards` | Create board | Yes |
| `PATCH` | `/api/boards/:id` | Update board | Yes |
| `DELETE` | `/api/boards/:id` | Delete board | Yes |
| `PATCH` | `/api/boards/:id/archive` | Archive/unarchive board | Yes |
| `PATCH` | `/api/boards/:id/favourite` | Favourite/unfavourite board | Yes |
| `GET` | `/api/boards/:id/members` | List board members | Yes |
| `POST` | `/api/boards/:id/members` | Invite member | Yes |
| `DELETE` | `/api/boards/:id/members/:memberId` | Remove member | Yes |

### Columns

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/columns` | List columns by board | Yes |
| `GET` | `/api/columns/:id` | Get column by ID | Yes |
| `POST` | `/api/columns` | Create column | Yes |
| `PATCH` | `/api/columns/:id` | Update column | Yes |
| `DELETE` | `/api/columns/:id` | Delete column | Yes |
| `PATCH` | `/api/columns/reorder` | Reorder columns | Yes |

### Tasks

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/tasks` | List tasks by board | Yes |
| `GET` | `/api/tasks/:id` | Get task by ID | Yes |
| `POST` | `/api/tasks` | Create task | Yes |
| `PATCH` | `/api/tasks/:id` | Update task | Yes |
| `DELETE` | `/api/tasks/:id` | Delete task | Yes |
| `PATCH` | `/api/tasks/reorder` | Reorder/move task | Yes |
| `POST` | `/api/tasks/:id/labels` | Add label | Yes |
| `DELETE` | `/api/tasks/:id/labels/:labelId` | Remove label | Yes |
| `POST` | `/api/tasks/:id/checklist` | Add checklist item | Yes |
| `PATCH` | `/api/tasks/:id/checklist/:itemId/toggle` | Toggle checklist item | Yes |
| `DELETE` | `/api/tasks/:id/checklist/:itemId` | Delete checklist item | Yes |
| `GET` | `/api/tasks/:id/comments` | Get comments | Yes |
| `POST` | `/api/tasks/:id/comments` | Add comment | Yes |
| `DELETE` | `/api/tasks/:id/comments/:commentId` | Delete comment | Yes |
| `GET` | `/api/tasks/:id/attachments` | Get attachments | Yes |
| `POST` | `/api/tasks/:id/attachments` | Upload attachment | Yes |
| `DELETE` | `/api/tasks/:id/attachments/:attachmentId` | Delete attachment | Yes |
| `GET` | `/api/tasks/:id/activity` | Get activity log | Yes |

### Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/users/search` | Search users | Yes |
| `GET` | `/api/users/:id` | Get user by ID | Yes |
| `PATCH` | `/api/users/profile` | Update profile | Yes |
| `GET` | `/api/users/boards` | Get user's boards | Yes |

### Response Format

All API responses follow a consistent envelope:

**Success (200-299):**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

**Error (400-599):**
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": { ... }
  },
  "statusCode": 400
}
```

---

## Development Roadmap

### Phase 1 — Foundation ✅
- [x] Project structure & folder setup
- [x] Frontend configuration (Vite, Tailwind, TypeScript)
- [x] Backend configuration (Express, Prisma, TypeScript)
- [x] Database schema design (Prisma)
- [x] Authentication system (JWT + bcrypt)
- [x] Frontend authentication UI
- [x] Centralized error handling & validation
- [x] Rate limiting & request logging

### Phase 2 — Core Features 🔄
- [x] Board CRUD operations
- [x] Column management & reordering
- [x] Task CRUD with drag & drop
- [x] Task details (checklist, comments, attachments)
- [x] Dashboard with statistics
- [ ] Search & filtering
- [ ] Productivity charts

### Phase 3 — Collaboration 🔵
- [x] Team member invitations
- [x] Role-based access control (Owner / Admin / Member)
- [ ] Activity logs & notifications
- [ ] Email notifications

### Phase 4 — Real-time 🔵
- [ ] Socket.IO integration
- [ ] Live cursor tracking
- [ ] Real-time updates
- [ ] Presence indicators

---

## Project Status

🚧 **In Active Development** — Core frontend components, pages, and backend middleware/utilities are implemented. Database schema, repositories, services, controllers, and routes are in progress.

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

*Built with ❤️ for production-grade team collaboration.*
