# Sprint Review — Topcard
**Date:** July 3, 2026 | **Period:** May 22 → July 3, 2026 | **Format:** Classic Agile

---

## Sprint Goal

Develop a functional web application for tracking One Piece TCG collections, with:
- a secure JSON API backend (auth, set and card management, external sync)
- an ergonomic Angular SPA frontend
- a reliable automated test suite

---

## Delivered Features

### Backend (May → early June)
| Feature | Status |
|---------|--------|
| AdonisJS v7 + PostgreSQL + Docker setup | Delivered |
| Database schema (User, Role, Card, Set, UserCard) | Delivered |
| Session-based auth + CSRF (login, signup, logout, /me) | Delivered |
| Collection API (add, remove, list, filters) | Delivered |
| Sets and cards API | Delivered |
| Admin sync with external TCG API | Delivered |
| Auth / guest / admin middleware | Delivered |
| Functional and unit tests (48 cases, Japa) | Delivered |

### Frontend (June 23 → June 30)
| Feature | Status |
|---------|--------|
| React/Inertia → Angular 22 standalone SPA migration | Delivered |
| Design system + navbar + Tailwind | Delivered |
| Auth pages (login, signup) | Delivered |
| Landing page (hero, set preview, how-it-works) | Delivered |
| Set list page with skeleton loading | Delivered |
| Set detail page with card grid | Delivered |
| Collection page with filters and optimistic updates | Delivered |
| Missing cards page with completion bar | Delivered |
| Card detail modal with collection controls | Delivered |
| Profile & statistics page | Delivered |
| Admin sync page with per-row loading state | Delivered |
| Styled 404 and 500 error pages | Delivered |
| Collection CSV export | Delivered |
| Login by username | Delivered |
| Optimized WebP/AVIF logo + PWA manifest | Delivered |

---

## What Was Not Delivered

| Feature | Reason |
|---------|--------|
| Angular service unit tests | Deprioritized after the frontend migration; deferred to next sprint |
| `pro` role implementation | Seeded but never functionally specified; not developed |
| Production deployment | Out of sprint scope (application runs locally via Docker) |
| Mid-sprint retrospectives | Process oversight — corrected with this end-of-cycle retrospective |

---

## Demo of Key Features

1. **Authentication** — registration, login by email or username, logout; persistent session via cookie
2. **Set browsing** — set list with preview, detail page with card grid and completion bar
3. **Collection management** — add/remove cards, filters (owned/missing), optimistic updates
4. **Export** — CSV download of the full collection
5. **Admin sync** — sync sets and cards from the external API, per-row loading state
6. **Profile** — personal statistics (completion rate, owned cards)

---

## Product Improvement Points Identified

- Add visual notifications (toast) on network errors during collection actions
- Clarify the `pro` role: define premium features or remove the role entirely
- Plan a deployment (VPS or PaaS) to validate behavior in a real environment

---

## Decisions for Next Sprint

- Write missing Angular tests (auth and collection services)
- Handle the `pro` role (remove or implement)
- Document the `role: null` behavior at signup
- Set up regular retrospectives (end of each sprint)
