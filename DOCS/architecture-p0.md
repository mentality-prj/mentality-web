# Frontend architecture modernization — integrated baseline

Scope: `mentality-web` (Next.js 16.4, React 19.3, App Router, NestJS and Zitadel OIDC).

## Integrated into dev

PR #435 established the CI baseline, public smoke tests and same-tab refresh deduplication. PR #437 added token-opaque browser sessions, the authenticated BFF, bounded request bodies, server session validation, incremental feature slices and the Next.js 16 toolchain.

- `GET /api/auth/token` returns browser-safe metadata, **not** JWTs.
- The browser calls `/api/backend/*` with a cookie; Next.js validates its session with NestJS before forwarding a server-owned bearer.
- Client-supplied Authorization, cookies and privileged API keys cannot replace the server-validated authority.
- `/auth/me` user-data endpoints remain available. Provider and token-verification routes are blocked.
- Server Components can make backend requests with the validated server session. User-specific responses are `no-store`.

## Outstanding production release gate

**Issue #439** requires live authenticated browser E2E on dedicated Zitadel/NestJS test tenants: login, callback, expiry and refresh races across tabs, logout, RBAC and tenant isolation. Anonymous smoke and mocked Jest tests are insufficient. Issue #436 remains open until the full BFF migration is qualified; issue #438 tracks framework release qualification.

## Next increments

1. Execute the real authenticated browser suite against an accessible deployment and dedicated test accounts.
2. Remove legacy import shims after their last callers have been migrated and tested.
3. Continue domain-specific API migration and typed DTO/error validation.
4. Qualify cross-request refresh rotation, cancellation and mutation idempotency.
5. Add streaming/error boundaries to costly SSR routes only with measured performance.

Never return `DIP_ADMIN_API_KEY` or privileged QDIP credentials to browser JavaScript.
