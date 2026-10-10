# Frontend architecture — phased modernization

Current architecture: Next.js App Router, React 18, NestJS backend, Zitadel OIDC and existing RBAC.

## New BFF transport boundary

Authenticated *browser* data calls using `apiRequest` go to `/api/backend/*`. The BFF validates the HttpOnly cookie with NestJS and sends the bearer token to NestJS server-to-server. Server Component calls continue directly to NestJS. The BFF never forwards upstream redirects or response cookies and rejects cross-origin mutations.

**Important:** this is the first phase of closing #436, not the end. The legacy browser token API and Zitadel client session still expose access tokens. Authentication callback, session response, logout and refresh flows must be migrated together before disabling the legacy token response.

## Domain boundaries

Target: `features/{mood,wellbeing,company,research,qdip}/{api,model,ui,hooks}`.
Keep `app` route files focused on composing those domains. Migrate one domain at a time and preserve existing imports using re-export shims only when required.

## Test gates

CI TypeScript + ESLint + Prettier + Jest. Real anonymous deployment smoke can be launched manually. Authentication e2e needs a dedicated test tenant; do not claim it passed without real login credentials. Always keep user-specific API data `no-store`.

## Next work

- Enforce token-opaque browser session and server-only refresh;
- update tests, docs and real authenticated E2E;
- move mood and company slices into `features`, standardize DTO decoders and error semantics;
- add SSR streaming and error boundaries to expensive routes;
- assess framework updates only against green CI and real deployment compatibility.
