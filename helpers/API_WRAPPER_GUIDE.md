# Authenticated HTTP data access

For browser requests, `apiRequest(session, configuredBackendUrl)` uses the same-origin `/api/backend/*` BFF; Next.js validates the HttpOnly cookie and injects the backend bearer server-side. **Never** request bearer credentials from `/api/auth/token`: it returns expiry/refresh availability metadata only.

For Server Components and Server Actions, `apiRequest` continues to use the validated server session and direct backend URL. Administrative access requires explicit backend-enforced RBAC. The BFF prohibits identity-provider route proxying, rejects cross-origin mutations and keeps responses `no-store`.

Error model: `{data,headers}` or `{error}`. All public user-facing callers must explicitly handle 401/403, validation errors and timeout.

Do not cache private B2C/cohort/diagnostic payloads across users, and never expose privileged QDIP service keys to browser bundles. See `DOCS/frontend-architecture.md`.
