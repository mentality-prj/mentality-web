# Single application API — audit and enforced boundary

## Contract

**One browser-facing application API:** same-origin Next.js `/api/backend/*`.
Every React data feature uses `apiRequest` / `performAuthRequest`, which proxies NestJS requests through this entrypoint. Public contact also uses `publicApiRequest('/contact', ...) → POST /api/backend/contact`, with strict origin, size and method validation. NestJS is the single application backend and validates reCAPTCHA for this public endpoint.

Zitadel is the **only identity provider**, not an additional application data API. Next.js `/api/auth/{exchange,token,session,logout}` is an OIDC/session lifecycle boundary, and `/callback` handles its redirect. Tokens remain HttpOnly. `/auth/validate-token` calls are performed by Next.js server code, not public browser helpers. Removed unused `validateToken` / `validateAccessToken` browser helpers.

## Trust boundaries and explicit exceptions

| Caller | API transport | Credential owner |
|---|---|---|
| React / feature requests | `/api/backend/*` → NestJS | Next.js HttpOnly session |
| Public contact form | `/api/backend/contact` → NestJS | Anonymous; reCAPTCHA in NestJS |
| Zitadel login/logout/refresh | `/api/auth/*` + OIDC redirect | Next.js only |
| SSR server components | Backend-validated server-side NestJS client | Next.js server |
| QDIP admin in SSR/actions | Direct QDIP server-only client (`requests/dipClient.ts`) | Next.js server `DIP_API_KEY` / `DIP_ADMIN_API_KEY` |
| Temporary new QDIP key display | Admin-only locale-scoped one-shot key-flash route | HttpOnly flash cookie and admin RBAC |

The two QDIP exceptions **must not become a browser-exposed generic API**. Moving them behind NestJS as the sole backend host requires a distinct authenticated NestJS integration for all QDIP admin capabilities, RBAC and tenant-scoped authorization. It is *not* safe to forward a privileged admin key through the generic user BFF.

## Enforcement

- `scripts/api-boundary.test.mjs` inspects application TypeScript/JS calls and fails on new direct `fetch` outside reviewed transports. Run with `node --test scripts/api-boundary.test.mjs`.
- Jest checks that anonymous contact permits only POST with same-origin and ≤1 MB body, never adds a bearer, and rejects cross-origin or oversized submissions.
- TypeScript/Jest/build and protected preview E2E gates are still required.

## Outstanding

Real Zitadel/NestJS browser E2E (#439) is required before production promotion. External QDIP management calls currently remain **server-to-server** until the NestJS integration and its authorization coverage exist. Browser requests must never use `DIP_URL` or receive `DIP_ADMIN_API_KEY`.
