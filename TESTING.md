# Testing

## Frontend

The Cypress tests cover the main user flow: registration, login, presentation
creation, slide management, element editing, preview, and logout.

```bash
cd frontend
npx cypress open
```

Test files are in `frontend/cypress/e2e`.

## Backend

The Jest and Supertest suite covers registration, login, logout, authentication,
and account-scoped store updates.

```bash
cd backend
npm test
```
