# DevTrack

**A Personal Learning & Project Tracker**

DevTrack is a full-stack web application designed to help developers organize their learning goals, manage daily progress, and track personal projects.

The project is being developed as a hands-on full-stack learning journey using **Next.js, NestJS, TypeScript, Prisma, and MySQL**.

## Project Status

🚧 **Under Active Development**

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
| Package Management | npm Workspaces |

## Features

### Implemented

- [x] NestJS backend setup
- [x] MySQL database connection with Prisma
- [x] Goal CRUD operations
- [x] Search, filtering, and pagination
- [x] Request validation with DTOs
- [x] Custom validation pipes
- [x] User registration
- [x] Password hashing with bcrypt
- [x] User login
- [x] JWT access token generation
- [x] JWT authentication strategy
- [x] Protected Goals API endpoints

### Planned

- [ ] User-specific goal ownership
- [ ] Daily task management
- [ ] Project progress tracking
- [ ] Frontend authentication
- [ ] Goals management UI
- [ ] Dashboard
- [ ] Search and filtering UI
- [ ] Deployment

## Project Structure

```text
devtrack/
├── apps/
│   ├── api/                 # NestJS backend
│   │   ├── prisma/
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   ├── common/
│   │   │   ├── goals/
│   │   │   └── prisma/
│   │   └── README.md
│   │
│   └── web/                 # Next.js frontend
│       └── README.md
│
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

Install the following:

- Node.js 24.15 or a compatible newer release
- npm
- MySQL Server

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

Add your JWT secret and Prisma database connection URL:

```env
JWT_SECRET=your_strong_random_secret
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/devtrack_db"
```

Use your own MySQL username and password.

**Important:** Never commit your `.env` file or expose your JWT secret.

See [Backend Documentation](apps/api/README.md) for database configuration details.

### 4. Run the Backend

From the root directory:

```bash
npm run dev:api
```

Backend runs at:

```text
http://localhost:3000
```

### 5. Run the Frontend

Open another terminal at the project root:

```bash
npm run dev:web
```

Next.js uses port 3000 by default. If the API is already using that port, Next.js will normally select another available port.

## Available Root Scripts

| Command | Description |
|---|---|
| `npm run dev:api` | Start NestJS development server |
| `npm run dev:web` | Start Next.js development server |
| `npm run build:api` | Build backend |
| `npm run build:web` | Build frontend |

## API Overview

Base URL:

```text
http://localhost:3000
```

### Authentication

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/auth/register` | Register a user | Public |
| POST | `/auth/login` | Login and receive JWT | Public |

### Goals

All Goals endpoints require a valid JWT Bearer token.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/goals` | Create a goal |
| GET | `/goals` | Get goals |
| GET | `/goals/count` | Count goals |
| GET | `/goals/:id` | Get a goal |
| PUT | `/goals/:id` | Update a goal |
| PATCH | `/goals/:id` | Partially update a goal |
| DELETE | `/goals/:id` | Delete a goal |

### Goals Query Parameters

The GET `/goals` endpoint supports:

```text
GET /goals?search=NestJS&completed=false&page=1&limit=10
```

| Parameter | Description |
|---|---|
| `search` | Search goals by title |
| `completed` | Filter by completion status |
| `page` | Page number |
| `limit` | Number of records per page |

### Authentication Header

For protected endpoints:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Documentation

- [Backend Documentation](apps/api/README.md)
- [Frontend Documentation](apps/web/README.md)

## Development Approach

This project is being developed incrementally:

1. Understand the concept
2. Implement the feature
3. Test the API or UI
4. Review the code
5. Commit and push changes

## Author

**Md. Rasel Aktar**

Frontend Developer | Full-Stack Development Learner

- GitHub: [@raselcsedev](https://github.com/raselcsedev)

## License

This project is currently a personal learning project.