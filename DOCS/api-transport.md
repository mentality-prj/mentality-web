# Single application API — request inventory (2026-10-11)

All application HTTP calls from browser code use the canonical `apiTransport` in `lib/api/transport.ts` and **same-origin `/api/*` URLs**. It rejects browser requests with external origins or caller-supplied bearer/cookie/admin-key headers. ESLint (`no-restricted-globals`) prevents new direct `fetch()` calls outside the transport; the standalone Node smoke runner is explicitly excluded.

## Flow

- **Domain APIs** (mood, personal goals, diary, achievements, favorites, tests, statistics, company/manager, research, reporting and translation checks): `performAuthRequest` → `apiRequest` → `apiTransport` → browser `/api/backend/*` → NestJS. The Next.js route validates the HttpOnly session, forwards only its server-authorized bearer and applies no-store, CSRF origin checks and body limits.
- **Public contact form**: `sendContactForm` → `apiTransport('/api/backend/contact')` → NestJS `POST /contact`. Exactly this unauthenticated POST is allowed; browser direct backend URLs are blocked. The NestJS contact service verifies reCAPTCHA only when configured in production; ensure its production secret is set and enable rate limiting before release.
- **OIDC**: login is an external browser _redirect to Zitadel_, not an application API fetch. Callback, metadata, refresh and logout use same-origin `/api/auth/*` routes via `apiTransport`. Next.js server exchanges/verifies tokens with Zitadel/NestJS using server-only credentials.
- **QDIP**: `requests/dipClient.ts` is invoked from Server Components/Actions and uses the common `apiTransport` to call the separate QDIP service with server-only DIP keys. QDIP is **not** an alternate identity provider and privileged keys never enter the browser.
- **One-time DIP key reveal**: same-origin `/api/internal/key-flash`, admin session required, HttpOnly path-scoped flash cookie consumed once.
- **Backend validation and infrastructure**: Next.js BFF, server-session validator, Next.js proxy and Zitadel exchange also use `apiTransport`. Server-only external service origins are still intentionally separate from the single browser API namespace.

## Guardrails

1. Browser code must never call NestJS or QDIP URLs directly or read access/refresh/ID JWTs.
2. The single transport does not replace domain-specific typed API clients. It is the central HTTP transport, not an unrestricted proxy to arbitrary paths.
3. Token verification endpoints `/auth/validate-token` are server-only. Old unused browser-callable token validators were retired.
4. Authenticated access and tenant scoping are enforced on the NestJS side; the BFF handles session forwarding, not role elevation.
5. CI validates lint, typecheck, unit tests, browser-origin transport checks, anonymous BFF contact rules and production build. **Real Zitadel E2E (#439) remains a mandatory production gate.**

## Remaining qualifications

Run the authenticated browser suite against a dedicated tenant. Verify the correct Zitadel/OIDC callback and concurrent refresh behavior, cross-tenant access denial, QDIP admin authorization, real contact reCAPTCHA behavior and the one-time flash-cookie path on an authorized preview before production deployment.
