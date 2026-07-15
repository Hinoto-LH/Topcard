# Bug Tracking — Topcard
**Period:** May 22 → July 3, 2026

Log of bugs identified and resolved during the project.

---

## Bug Table

| ID | Date | Severity | Description | Root Cause | Resolution | Commit |
|----|------|----------|-------------|------------|------------|--------|
| BUG-001 | 2026-06-26 | High | Registration form rejects valid passwords | Regex too restrictive, accepting only a subset of special characters | Replaced with a generic regex accepting any non-alphanumeric character | `6fd53fb` |
| BUG-002 | 2026-06-26 | High | Registration fails on the backend despite a valid form | `passwordConfirmation` field missing from the payload sent by `AuthService` | Added the field in the service and the form | `6fd53fb` |
| BUG-003 | 2026-06-26 | Low | Input field icons overlap with text | Global CSS `.field input` defined `px-4`, overriding `pl-10`/`pr-4` utilities | Removed `px-4` from the global style | `6fd53fb` |
| BUG-004 | 2026-06-30 | High | Frontend TypeScript compilation fails | `rootDir` missing from `tsconfig.app.json` and `tsconfig.spec.json` | Added `rootDir` explicitly to both files | `a613f28` |
| BUG-005 | 2026-06-30 | Medium | Login and signup templates broken after Angular migration | Leftover syntax from the old React/Inertia version | Rewrote templates in native Angular syntax | `682f57c` |
| BUG-006 | 2026-07-01 | High | Test suite returns content errors (404 instead of 422 on validations) | Test client was not sending `Accept: application/json`, triggering HTML content negotiation | Added `Accept: application/json` header in the test bootstrap | `ac5cfff` |
| BUG-007 | 2026-07-01 | High | Tests require a live PostgreSQL instance to run | `config/database.ts` was still using PostgreSQL in test environment | Configured SQLite as the test database via `app.inTest` | `ac5cfff` |
| BUG-008 | 2026-07-01 | Medium | `isAdmin()` returns `false` for an actual admin depending on seed order | Comparison was done on `roleId` (integer), sensitive to insertion order in the database | Comparison by role name (`'admin'`) on both frontend and backend | `ac5cfff` |
| BUG-009 | 2026-07-01 | Medium | CSV export fails outside the local environment | Export URL was hardcoded as `localhost:3333` in the collection component | Built the URL from `environment.apiUrl` | `ac5cfff` |
| BUG-010 | 2026-07-01 | Low | Route `/500` returns a 404 instead of displaying the error page | `ServerErrorComponent` created but not registered in the Angular router | Added the `/500` route in `app.routes.ts` | `ac5cfff` |

---

## Summary

| Severity | Count | All Resolved |
|----------|-------|--------------|
| High | 4 | Yes |
| Medium | 3 | Yes |
| Low | 3 | Yes |
| **Total** | **10** | **Yes** |

No open bugs at the end of the sprint.
