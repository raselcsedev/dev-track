# DevTrack API

The backend application for **DevTrack**, built with NestJS, TypeScript, Prisma, and MySQL.

## Tech Stack

- NestJS 12
- Node.js
- TypeScript
- Prisma ORM 7
- MySQL
- JWT Authentication
- Passport
- bcrypt
- class-validator
- class-transformer

## Features

- REST API architecture
- User registration
- Password hashing with bcrypt
- User login
- JWT access token generation
- JWT authentication strategy
- Protected API endpoints
- Goal CRUD operations
- Search and filtering
- Pagination
- DTO-based validation
- Custom validation pipes
- Prisma database integration

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
│   │   └── pipes/
│   │
│   ├── goals/
│   │   ├── dto/
│   │   ├── goals.controller.ts
│   │   ├── goals.module.ts
│   │   └── goals.service.ts
│   │
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   │
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
│
├── .env
├── prisma7.config.ts
├── package.json
└── README.md
```

## Prerequisites

- Node.js 24.15 or a compatible newer release
- npm
- MySQL Server

## Installation

From the repository root:

```bash
npm install
```

Or, from the API directory:

```bash
cd apps/api
npm install
```

## Environment Configuration

Create `.env` inside `apps/api/`.

```env
JWT_SECRET=your_strong_random_secret
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/devtrack_db"
```

Replace `USER` and `PASSWORD` with your MySQL credentials.

**Security:**

- Never commit `.env`.
- Never expose JWT secrets.
- Use a strong, randomly generated JWT secret.

### Database Configuration Note

Prisma migrations use `DATABASE_URL` through `prisma7.config.ts`.

The current `PrismaService` also configures the MariaDB adapter directly. Its database connection settings are currently defined in `src/prisma/prisma.service.ts`.

For production deployment, move these adapter settings into environment-based configuration rather than keeping credentials in source code.

## Database Setup

Create a MySQL database:

```sql
CREATE DATABASE devtrack_db;
```

From `apps/api/`, run:

```bash
npx prisma migrate dev
```

Generate Prisma Client:

```bash
npx prisma generate
```

Format the schema:

```bash
npx prisma format
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

## API Endpoints

Base URL:

```text
http://localhost:3000
```

### Authentication

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/auth/register` | Register a user | Not required |
| POST | `/auth/login` | Login and receive access token | Not required |

### Goals

| Method | Endpoint | Description |
|---|---|---|
| POST | `/goals` | Create a goal |
| GET | `/goals` | Get goals |
| GET | `/goals/count` | Count goals |
| GET | `/goals/:id` | Get a goal by ID |
| PUT | `/goals/:id` | Update a goal |
| PATCH | `/goals/:id` | Partially update a goal |
| DELETE | `/goals/:id` | Delete a goal |

All Goals endpoints are protected by `JwtAuthGuard`.

### Register Example

```http
POST /auth/register
Content-Type: application/json
```

```json
{
  "name": "DevTrack User",
  "email": "user@example.com",
  "password": "your_password"
}
```

### Login Example

```http
POST /auth/login
Content-Type: application/json
```

```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

A successful login returns an access token.

### Protected Request Example

```http
GET /goals
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Search and Pagination

```http
GET /goals?search=NestJS&completed=false&page=1&limit=10
```

Supported query parameters:

- `search`: Search by goal title
- `completed`: Filter by completion status
- `page`: Page number (minimum 1)
- `limit`: Records per page (1–100)

## Testing

Run unit tests:

```bash
npm run test --workspace=apps/api
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

## Available Scripts

| Command | Description |
|---|---|
| `npm run start:dev` | Start development server |
| `npm run start` | Start application |
| `npm run start:prod` | Start production build |
| `npm run build` | Compile application |
| `npm run lint` | Run Oxlint |
| `npm run format` | Format source files |
| `npm run test` | Run tests |
| `npm run test:cov` | Run test coverage |

## Development Notes

The API is under active development. Features and endpoints may change as the project evolves.

## Related Documentation

- [Main Project README](../../README.md)
- [Frontend README](../web/README.md)

## Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Passport Documentation](https://www.passportjs.org/)