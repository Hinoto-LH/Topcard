# Results and Lessons Learned — Topcard

**Period:** May 22 → July 3, 2026 | **Team:** solo development
**Project:** web application for tracking One Piece Card Game collections (AdonisJS · Angular · PostgreSQL)

---

## 1. Results Summary

### Key MVP Features

The delivered MVP covers the full collector journey:

- **Authentication** — registration, login by email or username, logout; session secured by cookie with CSRF protection
- **Catalogue** — list of sets with preview, detail page with card grid and completion bar, individual card detail view
- **Collection management** — adding and removing cards, quantity management, filters (owned / missing, by set), optimistic updates on the frontend
- **Missing cards** — list of missing cards by set with completion percentage, CSV export of the collection
- **Profile and statistics** — global completion rate and owned card count
- **Administration** — sync of sets and cards from the external TCG API, restricted to admin role

### Comparison with Initial Goals

The initial project goals are defined by the MoSCoW-prioritized user stories in the [technical documentation](READMEen.md) (16 stories in V1 scope, 3 deliberately deferred to V2/V3).

| Priority | Planned | Delivered | Rate |
|----------|---------|-----------|------|
| Must Have | 11 | 11 | 100% |
| Should Have | 4 | 4 | 100% |
| Could Have | 1 | 1 | 100% |
| **Total V1 scope** | **16** | **16** | **100%** |

The MVP reached **100% of planned features**, including the optional story (CSV export of missing cards). The 3 "Won't Have" stories (card market value, user trades, local store events) remain out of scope, as planned.

Two deviations from the original design, both intentional:

- **Frontend migration** — the project started with React/Inertia and was migrated to an Angular 22 SPA mid-project; the migration was completed without functional loss
- **No production deployment** — the application runs locally via Docker; deployment is identified as the next step

### Key Indicators

| Indicator | Value |
|-----------|-------|
| Stories delivered / planned (V1 scope) | 16 / 16 (100%) |
| Automated backend tests | 48 cases (40 functional + 8 unit), all green |
| Bugs logged during the project | 10 ([detailed tracking](BUG_TRACKING.md)) |
| Open bugs at end of cycle | 0 — all resolved |
| Merged pull requests | 30 |
| Cycle duration | 6 weeks |

---

## 2. Lessons Learned

### What Worked Well, and Why

- **Decoupled architecture from the start.** The strict separation between the JSON API backend and the SPA frontend made the React → Angular migration possible in a single day, without touching the backend. Investing early in architectural boundaries paid off at the most critical moment of the project.
- **Backend tests written during development.** The 48 Japa cases (isolated with SQLite and table truncation) acted as a safety net during stabilization: several regressions (content negotiation, role comparison) were caught by the test suite before reaching the user.
- **Disciplined git history.** Systematic `feat`/`fix` branches, conventional commits (feat / fix / chore / docs), and merge-by-pull-request made the project history readable — the [bug tracking](BUG_TRACKING.md) references fix commits directly.
- **MoSCoW prioritization.** Explicitly defining "Won't Have" items from day one prevented scope creep: no out-of-scope feature was ever started.

### Technical Difficulties and How They Were Solved

#### Security / Authentication

| Problem | Root Cause | Resolution |
|---------|------------|------------|
| CSRF protection failing on a decoupled SPA | Angular was not reading the `XSRF-TOKEN` cookie and not sending it back as `X-XSRF-TOKEN` header on mutating requests | Configured `HttpClientXsrfModule` and verified the cookie was readable by the Angular HTTP client |
| Session cookie not sent on cross-origin requests | Frontend (`localhost:4200`) and backend (`localhost:3333`) are on different origins; the browser blocks cookies by default | Added `withCredentials: true` on the Angular side and `credentials: 'include'` on fetch calls; set `Access-Control-Allow-Credentials: true` with a non-wildcard `Access-Control-Allow-Origin` on the backend |

**Key takeaway on session cookies:**
- `httpOnly: true` — the session cookie must never be accessible via JavaScript (`document.cookie`); if it is, any XSS vulnerability can steal it
- `secure: true` — the cookie must only transit over HTTPS; condition this flag to the environment so local dev is not broken
- `sameSite: lax` — protects against CSRF by not sending the cookie on cross-origin requests; `lax` is the right default for a SPA (`strict` breaks OAuth redirects)
- Session over JWT — a server-side session cookie allows immediate revocation (real logout); a JWT is stateless but cannot be invalidated before expiry without a blacklist

#### Testing

| Problem | Root Cause | Resolution |
|---------|------------|------------|
| Test suite returned 404 instead of 422 on validation errors | The test client was not sending `Accept: application/json`, triggering HTML content negotiation | Added `Accept: application/json` header in the test bootstrap (BUG-006) |
| Tests required a live PostgreSQL instance | `config/database.ts` was still using PostgreSQL in test environment | Configured SQLite as the test database via `app.inTest` (BUG-007) |

**Key takeaway:** always send `Accept: application/json` in API test clients — without it, frameworks that support content negotiation will respond with HTML and produce misleading status codes. Isolating tests from external infrastructure (replacing PostgreSQL with SQLite in test mode) makes the suite runnable anywhere, including CI.

#### Configuration / Environment

| Problem | Root Cause | Resolution |
|---------|------------|------------|
| CSV export failed outside local environment | Export URL was hardcoded as `localhost:3333` in the collection component | Built the URL from `environment.apiUrl` (BUG-009) |
| `isAdmin()` returned `false` for a real admin | Comparison was done on `roleId` (integer), sensitive to insertion order in the database | Compared by role name (`'admin'`) on both frontend and backend (BUG-008) |

**Key takeaways:**
- Never hardcode a URL in a component — always use an environment variable; a hardcoded URL works locally and breaks silently everywhere else
- IDs are fragile, names are stable — comparing `roleId === 1` depends on seed order; comparing `role.name === 'admin'` survives re-seeding and migrations

#### Stack Migration

| Problem | Root Cause | Resolution |
|---------|------------|------------|
| TypeScript compilation failed after Angular migration | `rootDir` missing from `tsconfig.app.json` and `tsconfig.spec.json` | Added `rootDir` explicitly to both files (BUG-004) |
| Login and signup templates broken after migration | Leftover React/Inertia syntax in Angular templates | Rewrote templates in native Angular syntax (BUG-005) |

**Key takeaway:** after a stack migration, old syntax and configuration do not always fail immediately — run an explicit post-migration audit of templates and config files rather than assuming everything was cleaned up.

### Areas for Improvement in Future Projects

- **Test the frontend at the same level as the backend.** The imbalance (48 backend tests, 0 frontend tests) is the main gap of this cycle; Angular service tests are the first action of the next sprint.
- **No dead code in the database.** The `pro` role, seeded but never specified, created confusion; any data introduced must have an associated user story, otherwise remove it.
- **Ritualize retrospectives.** A short retrospective at the end of each sprint would have allowed earlier course corrections (especially on frontend testing) instead of identifying everything at the end of the cycle.
- **Include deployment in the scope.** Validate the application in a real environment (VPS or PaaS) rather than only locally, to catch environment-dependent behaviors early.

---

## 3. Key Retrospective Points

A end-of-cycle retrospective was held on **July 3, 2026** (full report: [RETROSPECTIVE.md](RETROSPECTIVE.md)). As a solo project, the exercise took the form of a structured self-assessment.

### What worked well in the workflow?

- **Process discipline replaced team coordination**: systematic `feat`/`fix` branches, pull requests even when working solo, conventional commits — every change is traceable and readable
- **Continuous delivery** maintained a steady pace over 6 weeks with no tunnel effect: the git history shows consistent progress rather than large end-of-cycle dumps
- **Early architecture decisions** (decoupled backend and frontend) gave flexibility exactly when the project needed it most (Angular migration)

### What difficulties were encountered, and how were they resolved?

- **Mid-project stack migration** (React/Inertia → Angular 22) left residue (templates, TypeScript config) — resolved methodically through bug tracking (BUG-004, BUG-005) rather than improvised fixes
- **The test suite was coupled to local infrastructure** (PostgreSQL required) — resolved by isolating the test environment (SQLite, explicit JSON headers), making tests runnable anywhere
- **No retrospective during the cycle**: no mid-cycle review was held; structural problems (zero frontend tests, dead `pro` role) were only formalized at the end of the project

### How to improve collaboration on future projects?

- **Ritualize agile ceremonies even when working solo**: a short retrospective at the end of each sprint, scheduled from the sprint planning, to course-correct during the project rather than after
- **Treat the Kanban board as the single source of truth**: moving tracking to GitHub (issues + board) co-locates work and code — maintain this from day one of the next project
- **In a team context, solo practices translate directly**: systematic PRs become cross-reviews, shared bug tracking avoids duplicate diagnosis, and clear scope definitions (MoSCoW) reduce task assignment ambiguity
- **Allocate explicit test and stabilization time in each sprint**: the frontend/backend test imbalance came from a planning gap, not a time gap

---

*Related documents: [Sprint Review](SPRINT_REVIEW.md) · [Retrospective](RETROSPECTIVE.md) · [Bug Tracking](BUG_TRACKING.md) · [Project Links](LINKSen.md)*
