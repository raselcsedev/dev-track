# DevTrack API

The backend application for **DevTrack**, a full-stack personal learning and project tracking platform.

Built with NestJS, TypeScript, Prisma ORM, and MySQL.

## Tech Stack

- NestJS 12
- Node.js
- TypeScript
- Prisma ORM 7
- MySQL
- MariaDB Driver Adapter
- JWT Authentication
- Passport
- bcrypt
- class-validator
- class-transformer
- Vitest
- Swagger

## Features

### Authentication & Authorization

- [x] User registration
- [x] Password hashing with bcrypt
- [x] User login and logout
- [x] JWT access token generation
- [x] Passport JWT strategy
- [x] HTTP-only cookie authentication
- [x] Protected API endpoints
- [x] Current authenticated user profile
- [x] User-specific resource ownership

### Learning Goals

- [x] Create, read, update, and delete goals
- [x] Search by title
- [x] Filter by completion status
- [x] Pagination
- [x] User-specific goal management

### Daily Tasks

- [x] Create, read, update, and delete tasks
- [x] Completion status management
- [x] Task descriptions
- [x] Due date management
- [x] User-specific task management

### Project Tracking

- [x] Create, read, update, and delete projects
- [x] Project status management
- [x] Progress tracking (0–100%)
- [x] Start and end dates
- [x] User-specific project management

### Dashboard

- [x] Goal statistics
- [x] Task statistics
- [x] Project statistics
- [x] Average project progress
- [x] Recent tasks
- [x] Recent projects

### Backend Architecture

- [x] Modular NestJS architecture
- [x] Prisma database integration
- [x] DTO-based request validation
- [x] Custom validation pipes
- [x] Global response interceptor
- [x] Global HTTP exception filter
- [x] Application logging
- [x] Unit testing with Vitest
- [x] Swagger API documentation

## Project Structure

```text
apps/api/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── src/
│   ├── auth/
│   │   ├── dto/
│   │   ├── guards/
│   │   ├── strategies/
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   │
│   ├── common/
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── interceptors/
│   │   └── pipes/
│   │
│   ├── dashboard/
│   ├── goals/
│   │   └── dto/
│   ├── projects/
│   │   └── dto/
│   ├── tasks/
│   │   └── dto/
│   ├── prisma/
│   │
│   ├── app.module.ts
│   └── main.ts
│
├── .env
├── prisma7.config.ts
├── package.json
└── README.md
```

## Prerequisites

- Node.js 24.x
- npm 11.x
- MySQL Server
- Git

## Installation

From the repository root:

```bash
npm install
```

## Environment Configuration

Create an `.env` file inside `apps/api/`.

```env
JWT_SECRET=your_strong_random_secret
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/devtrack_db"
```

Replace `USER` and `PASSWORD` with your MySQL credentials.

**Security recommendations:**

- Never commit `.env`.
- Never expose JWT secrets.
- Use strong, randomly generated secrets.
- Keep database credentials outside source code.

### Database Configuration Note

Prisma CLI uses `DATABASE_URL` through `prisma7.config.ts`.

The current `PrismaService` uses `PrismaMariaDb` directly and has local database connection settings configured in its constructor.

These runtime settings should be moved to environment-based configuration before production deployment.

## Database Setup

Create the database in MySQL:

```sql
CREATE DATABASE devtrack_db;
```

From the API directory:

```bash
cd apps/api
```

Apply migrations during local development:

```bash
npx prisma migrate dev --config prisma7.config.ts
```

Generate Prisma Client:

```bash
npx prisma generate --config prisma7.config.ts
```

Format the Prisma schema:

```bash
npx prisma format --config prisma7.config.ts
```

Return to the repository root:

```bash
cd ../..
```

## Run the Application

From the repository root:

```bash
npm run dev:api
```

Or from `apps/api/`:

```bash
npm run start:dev
```

Backend URL:

```text
http://localhost:3000
```

## Build

From the repository root:

```bash
npm run build:api
```

Or from `apps/api/`:

```bash
npm run build
```

## API Overview

Base URL:

```text
http://localhost:3000
```

### Authentication

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/auth/register` | Register a user | Public |
| POST | `/auth/login` | Login and set authentication cookie | Public |
| GET | `/auth/me` | Get authenticated user profile | Protected |
| POST | `/auth/logout` | Clear authentication cookie | Available |

The login endpoint sets an HTTP-only cookie named `access_token`.

The frontend sends requests with credentials enabled.

### Goals

| Method | Endpoint | Description |
|---|---|---|
| POST | `/goals` | Create a goal |
| GET | `/goals` | Get user's goals |
| GET | `/goals/count` | Count goals |
| GET | `/goals/:id` | Get a goal by ID |
| PUT | `/goals/:id` | Update a goal |
| PATCH | `/goals/:id` | Partially update a goal |
| DELETE | `/goals/:id` | Delete a goal |

All Goals endpoints require authentication.

**Query Parameters:**

```http
GET /goals?search=NestJS&completed=false&page=1&limit=10
```

| Parameter | Description |
|---|---|
| `search` | Search goals by title |
| `completed` | Filter by completion status |
| `page` | Page number |
| `limit` | Number of records per page |

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| POST | `/tasks` | Create a task |
| GET | `/tasks` | Get user's tasks |
| GET | `/tasks/:id` | Get a task by ID |
| PATCH | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

All Tasks endpoints require authentication.

### Projects

| Method | Endpoint | Description |
|---|---|---|
| POST | `/projects` | Create a project |
| GET | `/projects` | Get user's projects |
| GET | `/projects/:id` | Get a project by ID |
| PATCH | `/projects/:id` | Update a project |
| DELETE | `/projects/:id` | Delete a project |

All Projects endpoints require authentication.

**Project Status Options:**

- `PLANNED`
- `IN_PROGRESS`
- `COMPLETED`
- `ON_HOLD`

### Dashboard

| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard/overview` | Get dashboard statistics and recent activities |

The overview includes:

- Total, completed, and pending goals
- Total, completed, and pending tasks
- Total and completed projects
- Average project progress
- Latest five tasks
- Latest five projects

The endpoint requires authentication.

## API Response Format

Successful API responses use a consistent structure:

```json
{
  "success": true,
  "data": {}
}
```

Error responses include:

- `success`
- `statusCode`
- `message`
- `timestamp`
- `path`

## Authentication

Authentication uses JWT with Passport.

The access token is stored in an HTTP-only cookie named `access_token`.

Cookie configuration:

- `httpOnly: true`
- `sameSite: lax`
- `secure` in production
- One-hour expiration

Protected endpoints use `JwtAuthGuard`.

User-specific resources are scoped to the authenticated user to enforce ownership.

## Testing

Run unit tests from the repository root:

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

Run end-to-end tests:

```bash
npm run test:e2e --workspace=apps/api
```

### Current Test Status

At the completion of Day 28:

- 12 test files passed
- 44 tests passed
- Backend production build successful

## Available Scripts

| Command | Description |
|---|---|
| `npm run start:dev` | Start development server |
| `npm run start` | Start application |
| `npm run start:prod` | Start production build |
| `npm run build` | Compile application |
| `npm run lint` | Run Oxlint |
| `npm run format` | Format source files |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:cov` | Run test coverage |
| `npm run test:e2e` | Run end-to-end tests |

## Related Documentation

- [Main Project README](../../README.md)
- [Frontend README](../web/README.md)

## Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Passport Documentation](https://www.passportjs.org/)