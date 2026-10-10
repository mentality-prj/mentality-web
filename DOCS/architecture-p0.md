# Frontend architecture modernization — P0 baseline

Scope: mentality-web (Next.js App Router). Changes must preserve current URLs, API contracts, and Zitadel login.

## Implemented in initial P0 PR

- Fix CI path-filter condition and cover all executable source/config paths, not only app/components.
- Execute typecheck, lint, formatting and Jest suite when application files change.
- Add an opt-in, no-credentials remote HTTP smoke check for public landing, anonymous route protections, CSRF guard and cache/security headers.
- Fix invalid NEXT_PUBLIC_BASE_URL fallback to prevent `undefined/api` URLs.

## P0 security migration — NOT yet resolved

`GET /api/auth/token` currently returns the access token to browser JavaScript; `AuthProvider`, `requests/*`, and client hooks depend on this behavior. HttpOnly cookies therefore do not yet form a genuine browser-to-backend BFF boundary. Removing the token response now would break authenticated features.

Required follow-up, as one incremental feature slice at a time:

1. Add a same-origin Next.js route-handler BFF using server-only credentials, explicit authorization and constrained upstream routes.
2. Validate API payloads and responses; scope all sensitive requests to the authenticated backend identity, never accept user/tenant IDs as trusted authority.
3. Move mood and personal-data client calls to the BFF first; retain server-side access for SSR pages.
4. Move remaining admin, company, research and QDIP client calls. Test permission boundaries and token rotation in real E2E.
5. Only after all browser API consumers are migrated, remove access/id tokens from the JSON returned by `/api/auth/token`; terminate client token access.
6. Consolidate refresh in the server session boundary. Cover simultaneous refresh, session expiry, revoked credentials, 401/403 and logout.

Do **not** expose `DIP_ADMIN_API_KEY` or privileged QDIP API credentials through the BFF; retain separate server-only roles.

## Follow-up gates

- Add authenticated browser E2E with dedicated low-privilege test accounts and test tenant; current remote smoke tests **only anonymous paths**.
- Keep user-sensitive responses `no-store` and never cross-user cache.
- Add cancellation/timeout and idempotency policy for mutations before new QDIP recommendation integrations.
- Migrate code towards `features/<domain>/{api,model,ui,hooks}` opportunistically, not with a bulk move.
- Schedule Next.js major upgrades separately after tests and auth boundary stabilize.
