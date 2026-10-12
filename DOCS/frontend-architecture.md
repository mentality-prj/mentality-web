# Frontend architecture — phased modernization

Current architecture: Next.js 16.4.0 App Router, React 19.3.0, NestJS backend, Zitadel OIDC and existing RBAC.

## New BFF transport boundary

Authenticated _browser_ data calls using `apiRequest` go to `/api/backend/*`. The BFF validates the HttpOnly cookie with NestJS and sends the bearer token to NestJS server-to-server. Server Component calls continue directly to NestJS. The BFF never forwards upstream redirects or response cookies and rejects cross-origin mutations.

**Current contract:** the browser token API and Zitadel session are token-opaque. The browser receives verified user metadata; tokens remain HttpOnly. The Next.js BFF explicitly allows authenticated user-data routes `GET /auth/me`, `GET/PATCH /auth/me/analytics-preferences`, but never exposes `/auth/validate-token` or OAuth endpoints. Old browser callers expecting bearer tokens must migrate to the same-origin BFF.

## Domain boundaries

Target: `features/{mood,wellbeing,company,research,qdip}/{api,model,ui,hooks}`.
Keep `app` route files focused on composing those domains. Migrate one domain at a time and preserve existing imports using re-export shims only when required.

## Test gates

CI TypeScript + ESLint + Prettier + Jest. Real anonymous deployment smoke can be launched manually. Authentication e2e needs a dedicated test tenant; do not claim it passed without real login credentials. Always keep user-specific API data `no-store`.

## Next work

- Execute authenticated Zitadel/NestJS browser E2E in an isolated tenant (#439), including refresh, logout and cross-tenant denial, before merging PR #437;
- remove remaining legacy consumer import shims only after verified migration;
- move mood and company slices into `features`, standardize DTO decoders and error semantics;
- add SSR streaming and error boundaries to expensive routes;
- retain Next.js 16 upgrade as release-candidate only: technical CI passed, but revert or remediate if authenticated preview E2E exposes regressions.
