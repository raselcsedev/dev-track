# DevTrack Web

The frontend application for **DevTrack**, built with Next.js, React, and TypeScript.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- ESLint

## Project Status

🚧 Frontend development is in progress.

## Features

The frontend will gradually include:

- User registration and login
- Dashboard
- Learning goals management
- Daily task management
- Project progress tracking
- API integration
- Search and filtering

## Prerequisites

- Node.js 24.15 or a compatible newer release
- npm

## Installation

From the repository root:

```bash
npm install
```

## Environment Configuration

Create `.env.local` inside `apps/web/` when configuring the API connection.

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Use the appropriate API URL for your environment.

Do not put private secrets in `NEXT_PUBLIC_` environment variables. These variables are exposed to the browser.

## Run the Development Server

From the repository root:

```bash
npm run dev:web
```

Or from `apps/web/`:

```bash
npm run dev
```

Open the URL displayed in your terminal. Next.js uses port 3000 by default and selects another available port if necessary.

## Build for Production

From the repository root:

```bash
npm run build:web
```

Or from `apps/web/`:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Lint

```bash
npm run lint
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Next.js development server |
| `npm run build` | Build the application |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Backend Integration

DevTrack uses a separate NestJS API.

Backend base URL:

```text
http://localhost:3000
```

Configure the API URL using `NEXT_PUBLIC_API_URL` in `.env.local`.

See [Backend Documentation](../api/README.md) for API endpoints and authentication details.

## Related Documentation

- [Main Project README](../../README.md)
- [Backend README](../api/README.md)

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)