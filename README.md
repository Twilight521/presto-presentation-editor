# Presto

Presto is a lightweight presentation editor built with React and TypeScript.
Users can create presentations, add slide content, customise themes, and open a
full-screen preview.

**Live demo:** [presto-presentation-editor.vercel.app](https://presto-presentation-editor.vercel.app/)

## Demo account

- Email: `demo@presto.app`
- Password: `PrestoDemo2026!`

This is a shared public demo account. Do not use a personal password or store
private information in it.

## Features

- Register, log in, and manage account-specific presentations
- Create, edit, and delete presentations and slides
- Add text, images, YouTube videos, and code blocks
- Change element position, size, colour, and appearance
- Set presentation or slide backgrounds
- Preview presentations with keyboard navigation
- Save presentation data through a lightweight Express API

## Tech stack

- Frontend: React 19, TypeScript, Vite, React Router, CSS Modules
- Backend: Express and JWT
- Storage: local JSON for development, Upstash Redis for deployment
- Testing: Jest, Supertest, and Cypress

## Project structure

```text
presto/
├── frontend/   # React application
├── backend/    # Express API
├── README.md
└── TESTING.md
```

## Run locally

Requires Node.js 20 or later and npm.

### 1. Start the backend

```bash
cd backend
cp .env.example .env
npm install
npm run start
```

The API runs at `http://localhost:5005`. If Upstash variables are empty, data
is saved to the gitignored `database.json` file.

### 2. Start the frontend

Open another terminal:

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

Backend (`backend/.env`):

```env
PORT=5005
JWT_SECRET=replace-with-a-long-random-value
CORS_ORIGIN=http://localhost:3000
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

Frontend (`frontend/.env.local`):

```env
VITE_API_BASE_URL=http://localhost:5005
```

Never commit real secrets. The `.env` files and local database files are
already excluded by `.gitignore`.

## Checks

```bash
cd frontend
npm run lint
npm run tsc
npm run build

cd ../backend
npm run lint
npm test
npm run build
```

## Deployment

The frontend and backend live in one repository but should be deployed as two
projects:

- Frontend root directory: `frontend`
- Backend root directory: `backend`

Deploy the backend first. Add its Upstash and JWT environment variables, then
set the frontend `VITE_API_BASE_URL` to the deployed backend URL. Set backend
`CORS_ORIGIN` to the deployed frontend URL.

## Scope

Presto is a portfolio MVP designed for demonstration and light usage. Images
are stored as data URLs, authentication is intentionally simple, and the app
does not support real-time collaborative editing.
