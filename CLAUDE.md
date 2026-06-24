# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

**Topcard** is a One Piece TCG collection tracker. It is split into two independent projects in the same repo:

- **Backend** (`/`): AdonisJS v7 — pure JSON API, no SSR. Handles auth, data, and external card sync.
- **Frontend** (`/frontend`): Angular 22 SPA — standalone components, signals, lazy-loaded routes.

Communication is cross-origin (`:3333` ↔ `:4200`). Auth uses sessions + CSRF cookies, not JWT.

## Commands

### Backend (root)
```bash
node ace serve --hmr          # Dev server with hot reload
node ace build                 # Production build
node ace test                  # All tests
node ace test --files="tests/functional/auth.spec.ts"  # Single test file
node ace migration:run         # Run pending migrations
node ace db:seed               # Seed roles (admin/user/pro)
node ace repl                  # Interactive REPL (used to create admin users)
eslint .                       # Lint
prettier --write .             # Format
```

### Frontend (`/frontend`)
```bash
npm start                      # Dev server on :4200 (ng serve)
npm run build                  # Production build
npm test                       # Vitest unit tests
```

### Docker (full stack)
```bash
docker compose up              # PostgreSQL + AdonisJS + Angular
docker compose logs app --tail=50
```

## Creating an Admin User

Admin accounts are **never seeded** — they must be created interactively:
```bash
node ace repl
# then:
const { default: User } = await import('#models/user')
const user = await User.create({ email: '...', password: '...', username: '...', firstName: '...', roleId: 1 })
```
`roleId: 1` = admin (seeded by `RoleSeeder`). Never hardcode admin credentials in any file.

## Database

- **Dev/Docker**: PostgreSQL via `docker-compose.yml`
- **Tests**: SQLite (`.env.test` sets `SESSION_DRIVER=memory`, no DB_* vars → falls back to SQLite at `tmp/db.sqlite3`)
- **Schema**: `database/schema.ts` is **auto-generated** by `node ace migration:run` — never edit it manually. Add columns/tables via new migration files.
- **Models**: `app/models/` extend the generated schemas. Relationships and auth logic live here.

## Auth & CSRF

- Sessions via `@adonisjs/session` (cookie-based, `SameSite=Lax`).
- CSRF via `@adonisjs/shield` with `enableXsrfCookie: true` — the server sets an `XSRF-TOKEN` cookie.
- **Angular's built-in XSRF does not work cross-origin.** The `credentials.interceptor.ts` manually reads the `XSRF-TOKEN` cookie and adds it as an `X-XSRF-TOKEN` header on all mutating requests.
- Always access via `http://localhost:4200`, not `http://127.0.0.1:4200` — the cookie domain must match.

## Key Gotchas

- `user.role` is a BelongsTo relationship — it is `undefined` unless explicitly loaded with `user.load('role')`. Use `user.roleId` (direct column) for quick role checks in controllers. The `AdminMiddleware` does call `user.load('role')` to check by name.
- `isAdmin()` in Angular checks `currentUser()?.role === 1` (roleId, not role name).
- The `GET /me` endpoint returns `{ user: { id, email, role: user.roleId } }` — it's called at app startup by `AuthService.fetchMe()` to restore the session.
- `SyncService.syncCards(setId)` expects the **database ID** (not `externalId`). Uses `Set.findOrFail(setId)` internally.
- `/admin/sync/sets` and `/admin/sync/cards/:setId` are exempted from CSRF in `config/shield.ts` (they're admin API calls).
- CSRF is disabled in tests (`!app.inTest`).

## Project Structure

```
app/
  controllers/   # One controller per resource
  middleware/    # auth, guest, admin, silent_auth
  models/        # Lucid ORM models (extend database/schema.ts classes)
  services/      # SyncService (external TCG API)
  validators/    # VineJS validators for request bodies
  transformers/  # (reserved)
database/
  migrations/    # Ordered migration files
  schema.ts      # Auto-generated column definitions — do not edit
  seeders/       # RoleSeeder (admin/user/pro)
start/
  routes.ts      # All API routes — Angular handles the page routes
  kernel.ts      # Middleware stack registration
frontend/src/app/
  pages/         # Lazy-loaded route components (auth, sets, collection, admin, errors)
  services/      # auth.ts, sets.ts, collection.ts, sync.ts — all use inject(HttpClient)
  guards/        # authGuard, guestGuard, adminGuard (functional)
  interceptors/  # credentials.interceptor.ts (XSRF + withCredentials)
  models/        # models.ts — TypeScript interfaces mirroring API responses
```

## Tests

Tests use [Japa](https://japa.dev). Functional tests truncate tables in `group.each.setup()` for isolation. The test bootstrap runs migrations and seeds roles if missing — tests never touch the dev database.

To run a specific test group, use `--files` with the file path or combine with `--groups`.
