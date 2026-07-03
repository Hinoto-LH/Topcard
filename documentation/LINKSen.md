# TopCard — Project Links

> Summary of links to project management resources, source code, and testing evidence.

| Resource | Link / Status |
|----------|---------------|
| Sprint planning | [GitHub kanban — sprint issues](https://github.com/Hinoto-LH/Topcard/issues?q=is%3Aissue+updated%3A%3E%40today-1w+sort%3Aupdated-desc) |
| Sprint reviews | [GitHub kanban — sprint issues](https://github.com/Hinoto-LH/Topcard/issues?q=is%3Aissue+updated%3A%3E%40today-1w+sort%3Aupdated-desc) |
| Retrospectives | [`documentation/RETROSPECTIVE.md`](https://github.com/Hinoto-LH/Topcard/blob/main/documentation/RETROSPECTIVE.md) — retrospective of July 3, 2026 |
| Source repository | [github.com/Hinoto-LH/Topcard](https://github.com/Hinoto-LH/Topcard) |
| Bug tracking | N/A — no dedicated tool was used (solo project); the repository's GitHub Issues remain available for reports |
| Testing evidence and results | [`tests/` folder](https://github.com/Hinoto-LH/Topcard/tree/main/tests) — 48 functional and unit test cases ([Japa](https://japa.dev)), run with `node ace test` — detailed in the tables below |
| Production environment | N/A — the application is not deployed online; it runs locally via `docker compose up` (PostgreSQL + AdonisJS + Angular) |

## Details

### Sprint management (GitHub)

Agile tracking (sprint planning and reviews) is managed as a kanban directly on GitHub, through the repository issues:
**https://github.com/Hinoto-LH/Topcard/issues?q=is%3Aissue+updated%3A%3E%40today-1w+sort%3Aupdated-desc**

This view filters issues updated during the last week (current sprint), sorted by recent activity.

### Tests

Backend tests live in the repository: **48 cases** in total (40 functional + 8 unit), written with [Japa](https://japa.dev).

Run with: `node ace test` (dedicated SQLite test database, no PostgreSQL dependency).

#### Functional tests — `tests/functional/auth.spec.ts` (10 cases)

| Group | Test case |
|-------|-----------|
| Signup | `POST /signup` creates the account, logs it in and returns the user |
| Signup | `POST /signup` rejects a weak password (422) |
| Signup | `POST /signup` rejects an already-taken username (422) |
| Login | `POST /login` with valid credentials returns 200 + user |
| Login | `POST /login` with a wrong password fails and creates no session |
| Login | `POST /login` with an unknown username creates no session |
| Session | `GET /me` returns 401 when not logged in |
| Session | `GET /me` returns the logged-in user |
| Session | `POST /logout` logs out and returns `{ ok: true }` |
| Guest middleware | `POST /login` redirects if the user is already logged in |

#### Functional tests — `tests/functional/collection.spec.ts` (12 cases)

| Group | Test case |
|-------|-----------|
| Auth middleware | `GET /collection` returns 401 when not logged in |
| Auth middleware | `POST /collection` returns 401 when not logged in |
| Index | `GET /collection` returns 200 + userCards + sets |
| Index | `GET /collection` with a set filter returns 200 |
| Add card | `POST /collection` adds the card with quantity 1 |
| Add card | `POST /collection` creates no duplicate if the card is already present |
| Update quantity | `PATCH /collection/:id` updates the quantity |
| Update quantity | `PATCH /collection/:id` rejects a quantity < 1 (422) |
| Update quantity | `PATCH /collection/:id` of another user returns 404 |
| Delete | `DELETE /collection/:id` removes the row |
| Delete | `DELETE /collection/:id` of another user returns 404 |
| Missing cards | `GET /collection/missing/:id` returns set, missCards and completion |

#### Functional tests — `tests/functional/sets.spec.ts` (9 cases)

| Group | Test case |
|-------|-----------|
| Sets > list | `GET /sets` returns 200 without being logged in |
| Sets > list | `GET /sets` returns the existing sets |
| Sets > detail | `GET /sets/:id` returns 200 for a logged-in user |
| Sets > detail | `GET /sets/:id` returns 404 if the set does not exist |
| Sets > detail | `GET /sets/:id` includes ownerCardsIds and completion for the user |
| Sets > detail | `GET /sets/:id` returns empty ownerCardsIds for a non-logged-in visitor |
| Cards > detail | `GET /cards/:id` returns the card (owned=0) for a visitor |
| Cards > detail | `GET /cards/:id` reflects ownership for a logged-in user |
| Cards > detail | `GET /cards/:id` returns 404 if the card does not exist |

#### Functional tests — `tests/functional/sync.spec.ts` (9 cases)

| Group | Test case |
|-------|-----------|
| Auth + admin middleware | `GET /admin/sync` returns 401 when not logged in |
| Auth + admin middleware | `GET /admin/sync` returns 403 if the user is not an admin |
| Auth + admin middleware | `GET /admin/sync` returns 200 (+ sets) for an admin |
| Role in user payload | `GET /me` returns role="admin" for an administrator |
| Role in user payload | `GET /me` returns role=null for a user without a role |
| Sets sync | `POST /admin/sync/sets` creates the sets and returns `{ synced }` |
| Sets sync | `POST /admin/sync/sets` returns 500 if the API fails |
| Cards sync | `POST /admin/sync/cards/:setId` creates the cards (database id) and returns `{ synced }` |
| Cards sync | `POST /admin/sync/cards/:setId` returns 500 if the set is unknown |

#### Unit tests — `tests/unit/sync_service.spec.ts` (8 cases)

| Group | Test case |
|-------|-----------|
| SyncService > syncSets | Creates the sets from the API and returns the right counter |
| SyncService > syncSets | Upserts — updates the set if the externalId already exists |
| SyncService > syncSets | Throws an error if the API responds with an error |
| SyncService > syncSets | Collects per-item errors without interrupting the sync |
| SyncService > syncCards | Creates a set's cards and returns the right counter |
| SyncService > syncCards | Upserts — no duplicate if the card already exists |
| SyncService > syncCards | Handles pagination — makes as many API calls as needed |
| SyncService > syncCards | Throws an error if the set is not found in the database |

### Production

No hosted production environment. The full stack runs locally:

```bash
docker compose up   # PostgreSQL + AdonisJS (:3333) + Angular (:4200)
```
