# Presto API

Express API for Presto authentication and presentation storage.

## Local development

Requires Node.js 20 or later.

```bash
cp .env.example .env
npm install
npm run start
```

The API starts at `http://localhost:5005`, with Swagger documentation at
`http://localhost:5005/docs`.

Generate a private value for `JWT_SECRET` before deploying. Production secrets
belong in the hosting provider's environment settings and must never be
committed to source control.

## Persistence

Local development uses the gitignored `database.json` file. For deployment,
create an Upstash Redis database and configure these environment variables in
the hosting provider:

```text
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

When both variables are present, the API uses Upstash Redis automatically. Do
not commit their values to source control.
