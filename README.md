# DevTrack — Personal Learning & Project Tracker

**A Full-Stack Application for Managing Learning Goals, Daily Tasks, and Personal Projects.**

DevTrack is a full-stack web application that helps developers organize their learning journey, manage daily tasks, monitor project progress, and track personal development from a centralized dashboard.

Built with **Next.js, NestJS, TypeScript, Prisma, and MySQL**, this project demonstrates practical full-stack development, REST API design, authentication, database management, frontend integration, and automated testing.

## Project Status

**Under Active Development**

Core features including authentication, learning goals, daily tasks, project tracking, and dashboard analytics have been implemented.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript |
| Backend | NestJS 12, TypeScript, Node.js |
| Database | MySQL |
| ORM | Prisma 7 |
| Authentication | JWT, Passport, bcrypt |
| Validation | class-validator, class-transformer |
| Styling | Tailwind CSS 4 |
| API Documentation | Swagger |
| Testing | Vitest |
| Package Management | npm Workspaces |
| Version Control | Git, GitHub |

## Features

### Authentication & Authorization

- [x] User registration
- [x] Secure password hashing with bcrypt
- [x] User login and logout
- [x] JWT authentication with Passport
- [x] HTTP-only cookie-based authentication
- [x] Protected API endpoints
- [x] Current authenticated user retrieval
- [x] User-specific data ownership
- [x] Unauthorized access protection

### Learning Goals Management

- [x] Create learning goals
- [x] Retrieve all goals
- [x] Retrieve individual goals
- [x] Update and delete goals
- [x] Mark goals as completed
- [x] Search goals by title
- [x] Filter by completion status
- [x] Pagination
- [x] User-specific goal management
- [x] Frontend CRUD interface

### Daily Task Management

- [x] Create daily tasks
- [x] Retrieve tasks
- [x] Update and delete tasks
- [x] Mark tasks as completed
- [x] Manage task descriptions
- [x] Set due dates
- [x] Frontend CRUD interface
- [x] User-specific task management

### Project Tracking

- [x] Create personal projects
- [x] Retrieve project lists and individual projects
- [x] Update and delete projects
- [x] Project status management
- [x] Track project progress (0–100%)
- [x] Set project start and end dates
- [x] Frontend project management interface
- [x] User-specific project management

**Project Status Options:**
- PLANNED
- IN_PROGRESS
- COMPLETED
- ON_HOLD

### Dashboard & Analytics

- [x] Overview of learning goals
- [x] Completed and pending goal statistics
- [x] Daily task statistics
- [x] Project statistics
- [x] Average project progress
- [x] Recent tasks
- [x] Recent projects
- [x] Authenticated dashboard

### Backend Architecture & Quality

- [x] Modular NestJS architecture
- [x] Prisma ORM integration
- [x] DTO-based request validation
- [x] Custom validation pipes
- [x] Global response interceptor
- [x] Global HTTP exception filter
- [x] Application logging
- [x] User ownership enforcement
- [x] Unit testing with Vitest
- [x] Swagger API documentation

## Application Screens

The application includes the following main pages:

| Page | Description |
|---|---|
| Dashboard | Overview of goals, tasks, projects, and progress |
| Goals | Manage personal learning goals |
| Tasks | Manage daily activities and due dates |
| Projects | Track project status and progress |
| Login | Authenticate existing users |
| Register | Create a new account |

## Project Structure

```text
devtrack/
├── apps/
│   ├── api/                         # NestJS backend
│   │   ├── prisma/
│   │   │   ├── migrations/
│   │   │   └── schema.prisma
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   ├── common/
│   │   │   ├── dashboard/
│   │   │   ├── goals/
│   │   │   ├── prisma/
│   │   │   ├── projects/
│   │   │   ├── tasks/
│   │   │   └── app.module.ts
│   │   └── README.md
│   │
│   └── web/                         # Next.js frontend
│       ├── app/
│       │   ├── (auth)/
│       │   ├── (dashboard)/
│       │   ├── components/
│       │   └── layout.tsx
│       ├── lib/
│       │   └── api/
│       └── README.md
│
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js 24.x
- npm 11.x
- MySQL Server
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/raselcsedev/dev-track.git

cd dev-track
```

### 2. Install Dependencies

Install dependencies for both applications from the root directory:

```bash
npm install
```

### 3. Configure the Backend

Create an `.env` file inside `apps/api/`.

Configure your database connection and JWT secret:

```env
JWT_SECRET=your_strong_random_secret
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/devtrack_db"
```

Replace the database username and password with your own credentials.

**Important:** Never commit your `.env` file or expose your JWT secret.

See [Backend Documentation](apps/api/README.md) for additional database configuration details.

### 4. Configure the Frontend

Create an `.env.local` file inside `apps/web/`.

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 5. Set Up the Database

From the backend workspace, configure Prisma and apply the existing migrations according to the backend setup instructions.

```bash
cd apps/api

npx prisma generate --config prisma7.config.ts

npx prisma migrate deploy --config prisma7.config.ts
```

Return to the project root before starting the applications:

```bash
cd ../..
```

### 6. Run the Backend

From the project root:

```bash
npm run dev:api
```

Backend:

```text
http://localhost:3000
```

### 7. Run the Frontend

Open another terminal at the project root:

```bash
npm run dev:web
```

Frontend:

```text
http://localhost:3001
```

If port 3000 is already occupied by the backend, Next.js normally selects another available port.

## Available Root Scripts

| Command | Description |
|---|---|
| `npm run dev:api` | Start NestJS development server |
| `npm run dev:web` | Start Next.js development server |
| `npm run build:api` | Build backend |
| `npm run build:web` | Build frontend |

### Backend Testing

Run backend unit tests:

```bash
npm test --workspace=apps/api
```

Run tests in watch mode:

```bash
npm run test:watch --workspace=apps/api
```

Run test coverage:

```bash
npm run test:cov --workspace=apps/api
```

## API Overview

Base URL:

```text
http://localhost:3000
```

All protected endpoints require authentication.

### Authentication

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/auth/register` | Register a new user | Public |
| POST | `/auth/login` | Authenticate a user | Public |
| GET | `/auth/me` | Get current user | Protected |
| POST | `/auth/logout` | Logout user | Protected |

Login establishes an HTTP-only authentication cookie.

### Learning Goals

| Method | Endpoint | Description |
|---|---|---|
| POST | `/goals` | Create a goal |
| GET | `/goals` | Get user's goals |
| GET | `/goals/count` | Count goals |
| GET | `/goals/:id` | Get a specific goal |
| PUT | `/goals/:id` | Update a goal |
| PATCH | `/goals/:id` | Partially update a goal |
| DELETE | `/goals/:id` | Delete a goal |

**Query Parameters:**

```text
GET /goals?search=NestJS&completed=false&page=1&limit=10
```

| Parameter | Description |
|---|---|
| `search` | Search goals by title |
| `completed` | Filter by completion status |
| `page` | Page number |
| `limit` | Number of records per page |

### Daily Tasks

| Method | Endpoint | Description |
|---|---|---|
| POST | `/tasks` | Create a task |
| GET | `/tasks` | Get user's tasks |
| GET | `/tasks/:id` | Get a specific task |
| PATCH | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

### Projects

| Method | Endpoint | Description |
|---|---|---|
| POST | `/projects` | Create a project |
| GET | `/projects` | Get user's projects |
| GET | `/projects/:id` | Get a specific project |
| PATCH | `/projects/:id` | Update a project |
| DELETE | `/projects/:id` | Delete a project |

### Dashboard

| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard/overview` | Get dashboard statistics and recent activities |

The dashboard overview includes:

- Total, completed, and pending goals
- Total, completed, and pending tasks
- Total and completed projects
- Average project progress
- Latest five tasks
- Latest five projects

## API Response Format

Successful responses follow a consistent structure:

```json
{
  "success": true,
  "data": {}
}
```

Error responses include status information, a message, timestamp, and request path.

## Security

- Passwords are hashed using bcrypt.
- JWT-based authentication protects private endpoints.
- Authentication cookies are HTTP-only.
- Protected resources are scoped to the authenticated user.
- DTO validation helps prevent invalid request data.
- Ownership checks prevent users from accessing other users' resources.

## Testing & Build Status

At the completion of Day 28:

| Validation | Result |
|---|---|
| Backend unit tests | 44 tests passed |
| Backend production build | Successful |
| Frontend TypeScript check | Successful |
| Frontend production build | Successful |
| Dashboard API testing | Successful |
| Frontend integration testing | Successful |

## Documentation

- [Backend Documentation](apps/api/README.md)
- [Frontend Documentation](apps/web/README.md)

## Development Approach

DevTrack is being developed incrementally through a practical full-stack learning process:

1. Understand the concept
2. Design and implement the feature
3. Integrate frontend and backend
4. Test API and UI functionality
5. Review and improve the implementation
6. Commit and push changes to GitHub

## Future Improvements

Potential enhancements include:

- [ ] Advanced search and filtering across all modules
- [ ] Improved dashboard analytics and visualizations
- [ ] Enhanced pagination for tasks and projects
- [ ] Notifications and reminders
- [ ] Deployment and production configuration
- [ ] Additional automated integration and E2E tests

## Author

**Md. Rasel Aktar**

Frontend Developer | Full-Stack Development Learner

- GitHub: [@raselcsedev](https://github.com/raselcsedev)

## License

This project is currently developed as a personal learning project. No open-source license has been specified yet.