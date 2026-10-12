# Authentication and browser API boundary

## Current architecture

Dzvin.co uses Zitadel Authorization Code + PKCE, Next.js 16 App Router and NestJS. The server holds access, ID and refresh tokens in the HttpOnly `auth-tokens` cookie. Browser JavaScript receives only verified user details and token-expiry metadata.

**Do not use browser `getToken()` or attach an `Authorization` header from React.** The deprecated `getToken()` intentionally returns `null`. Never put a Zitadel JWT, QDIP/DIP admin key or backend secret into client-side state.

## Login and session lifecycle

1. `ZitadelAuthProvider.login()` creates a PKCE verifier, challenge and state, then redirects to Zitadel.
2. `/callback` validates the returned state and submits the code and verifier to `POST /api/auth/exchange`.
3. Next.js exchanges the code using the server-only Zitadel secret and sets an HttpOnly, SameSite=Lax cookie (Secure in production). Response JSON contains only metadata.
4. `GET /api/auth/session` returns the NestJS-validated user, never access, refresh or ID tokens.
5. `GET /api/auth/token` returns safe expiry metadata. `POST /api/auth/token` rejects browser-written JWTs.
6. `POST /api/auth/exchange` with `grantType: 'refresh_token'` refreshes via the server-owned cookie. `POST /api/auth/logout` clears the cookie and redirects through Zitadel logout.

The browser provider deduplicates refresh within its own instance. **Concurrent multi-tab and server refresh require real authenticated E2E evidence** (issue #439).

## Authenticated data requests

Use `performAuthRequest()` or `apiRequest()` with the browser session and the configured NestJS API URL. The helper routes browser requests through same-origin `/api/backend/*`. The Next.js server verifies the cookie with NestJS and supplies the validated bearer **server-to-server**. Caller-provided bearer tokens, cookies and privileged API keys are rejected.

Example:

```ts
import { performAuthRequest } from '@/requests/genericFetch'
import { APIUrl } from '@/requests/config'

const result = await performAuthRequest(session, APIUrl + '/mood-record', { method: 'GET' })
```

Server Components may call NestJS directly using their already-validated server session. The BFF enforces `no-store`, same-origin mutation checks, bounded bodies and constrained upstream routes. User-data endpoints `GET /auth/me` and `GET/PATCH /auth/me/analytics-preferences` remain available through the BFF; token and identity-provider endpoints do not.

## Key files

- `lib/auth/providers/zitadel.ts` — PKCE and client session actions
- `context/AuthProvider.tsx` — verified user metadata and refresh scheduling
- `lib/auth/server.ts` — server session validation and timeout
- `app/api/auth/{exchange,session,token,logout}/route.ts` — server-owned authentication
- `app/api/backend/[...path]/route.ts` — authenticated NestJS BFF
- `helpers/api-wrapper.ts` — same-origin transport and caller-credential filtering
- `proxy.ts` — Next.js 16 routing and security headers

`ZITADEL_CLIENT_SECRET` is server-only. Public configuration uses `NEXT_PUBLIC_ZITADEL_ISSUER`, `NEXT_PUBLIC_ZITADEL_CLIENT_ID` and `NEXT_PUBLIC_BASE_URL`. The NestJS base URL is `NEXT_PUBLIC_API_URL`.

## Qualification

PR #437 was merged into `dev` after TypeScript, ESLint, Prettier, Jest, smoke and production build checks passed. **Production release is not yet qualified.** Dedicated Zitadel/NestJS test tenants must verify real login/callback, refresh and concurrency, logout, cross-tenant RBAC and the absence of browser-visible JWTs (issue #439).

See `DOCS/frontend-architecture.md` and issues #436, #438 and #439.
