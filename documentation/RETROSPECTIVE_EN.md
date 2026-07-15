# Sprint Retrospective — Topcard
**Date:** July 3, 2026 | **Format:** Classic Agile

---

## What Went Well

- **Clean architecture from the start** — the strict separation between backend and frontend as two independent projects avoided unnecessary coupling and simplified decisions throughout the cycle
- **Successful Angular migration** — the switch from React/Inertia to Angular 22 was completed in a single day with no residual debt, using standalone components and lazy-loading
- **Reliable backend tests** — 48 Japa cases covering auth, sets, collection, and sync; isolated with table truncation and SQLite in test mode, no impact on the dev database
- **Continuous delivery** — features and fixes committed regularly, readable and consistent git history (feat / fix / chore / docs)
- **Optimized assets** — WebP/AVIF images and PWA manifest integrated early, no performance debt to catch up on

---

## What Did Not Go Well

- **No frontend tests** — a single empty `app.spec.ts`; Angular services (auth, collection, sets, sync) are not covered
- **Unused `pro` role** — seeded in the database from the start, never used in the backend or frontend, a source of confusion
- **Signup returns `role: null`** — undocumented behavior at development time, discovered later during stabilization
- **No retrospectives during the project** — first review only at end of cycle; adjustments could have been made earlier

---

## Actions for Next Sprint

| Priority | Action | When |
|----------|--------|------|
| High | Write unit tests for Angular services (auth, collection) | Week of July 7 |
| High | Remove or implement the `pro` role — do not leave dead code in the database | Week of July 7 |
| Medium | Document the `role: null` behavior at signup in README/CLAUDE.md | Week of July 7 |
| Low | Set up retrospectives at the end of each sprint | Next sprint |
