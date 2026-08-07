# DEALPORT API

NestJS + Prisma + PostgreSQL backend for the DEALPORT admin dashboard take-home. Provides JWT auth and a fully validated Products/Categories/Tags API consumed by the [dealport-web](https://github.com/lahiruyasas7/dealport-web) frontend.

**Live App:** `https://dealport-web.vercel.app/`

**Live API:** `https://dealport-api.onrender.com/api/v1`
*(Hosted on Render's free tier — the instance spins down after inactivity, so the first request after a while can take 40–50s to wake up.)*

## Repositories
1. Frontend: https://github.com/lahiruyasas7/dealport-web 
2. Backend: https://github.com/lahiruyasas7/dealport-api

## Tech Stack

### Backend

1. NestJS
2. Prisma
3. PostgreSQL
4. JWT bearer token
5. AWS S3 (image storage)

### Frontend

1. Next.js
2. Axios
3. React Hook Form + Zod
4. React-Query
5. Zustand
6. Tailwindcss
7. Shadcn

## Deployment

1. Frontend: Vercel
2. Backend: Render
3. Database: Prisma.io Postgresql database


## Project structure

```
src/
├── auth/            # login, JWT strategy/guard, current-user decorator
├── category/         # GET /categories (read-only, seeded)
├── tags/              # GET /tags (read-only, seeded)
├── products/          # full CRUD, search + pagination
├── uploads/           # POST /uploads/presigned-url (S3)
├── prisma/            # PrismaService (injectable client)
└── main.ts            # global prefix, CORS, ValidationPipe
prisma/
├── schema.prisma
├── migrations/
└── seed.ts            # seeds one admin user + categories + tags
```

## Data model

- **User** — `email`, hashed `password`, `role` (`ADMIN` | `SELLER`)
- **Product** — basic details, pricing (`Decimal`), inventory (`stockQuantity` / `isUnlimited` toggle / `stockStatus`), `status` (`DRAFT` | `PUBLISHED`), `images: string[]`, `colors: string[]`, many-to-many with `Category` and `Tag`, owned by a `User` (`createdById`)
- **Category**, **Tag** — simple lookup tables, seeded, read-only via the API

Indexes on `Product.name`, `Product.status`, `Product.createdAt` support the required search + pagination + filter-by-status queries.

## API reference

All routes are prefixed with `/api/v1`.

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/auth/login` | – | Returns `{ accessToken, user }` |
| GET | `/products` | JWT | List, with `?search=&status=&categoryId=&page=&limit=` (max `limit` 100) |
| POST | `/products` | JWT | Create (owner = current user) |
| GET | `/products/:id` | JWT | Fetch one |
| PATCH | `/products/:id` | JWT | Update (category/tag arrays are replaced via `set`, not merged) |
| DELETE | `/products/:id` | JWT | Delete — scoped to `createdById`, so you can't delete another seller's product |
| GET | `/categories` | JWT | Seeded list |
| GET | `/tags` | JWT | Seeded list |
| POST | `/uploads/presigned-url` | JWT | Returns a short-lived S3 `uploadUrl` + the resulting `publicUrl` |

All `/products`, `/categories`, `/tags`, `/uploads` routes require `Authorization: Bearer <token>`.

## Environment variables

See `.env.example`. No secrets are committed — copy it to `.env` and fill in real values locally / in Render's dashboard for deployment.

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `JWT_SECRET` | ✅ | Sign/verify secret for access tokens |
| `JWT_EXPIRES_IN` | – | Defaults to `24h` |
| `PORT` | – | Defaults to `3003` |
| `FRONTEND_URL` | ✅ | Exact origin allowed by CORS (e.g. `https://dealport-web.vercel.app`) |
| `AWS_REGION` | ✅ | For S3 presigned uploads |
| `AWS_S3_BUCKET` | ✅ | Target bucket |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | ✅ | IAM user scoped to `s3:PutObject` on that bucket only |

added mock data for sales cards and report graphs, transaction table.

## Local setup

```bash
npm install
cp .env.example .env        # fill in DATABASE_URL, JWT_SECRET, AWS_*, FRONTEND_URL

npx prisma migrate dev      # applies migrations
npx prisma db seed          # seeds admin user + categories + tags

npm run start:dev           # http://localhost:3003/api/v1
```

## Seed credentials (for reviewers)

```
email:    admin@dealport.com
password: Admin@12345
```

```
## Known limitations / things I'd do next with more time

- No refresh-token flow — access tokens just expire after `JWT_EXPIRES_IN` and the user re-logs in. Fine for a scoped admin tool, not what I'd ship for a consumer product.
- No rate limiting on `/auth/login` (e.g. `@nestjs/throttler`) — worth adding before this goes anywhere near production.
- No integration tests for the Products module yet — `test/app.e2e-spec.ts` is still the Nest starter boilerplate.
- Categories/Tags are read-only via the API (seeded only), matching the "out of scope" list in the brief.
