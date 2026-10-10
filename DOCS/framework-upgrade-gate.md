# Framework upgrade gate

The repository currently uses Next.js 14 / React 18 with synchronous `cookies()` / `headers()`, middleware token refresh, `next lint` and legacy ESLint configuration.

Do **not** bump framework versions in an unqualified bulk dependency PR: this would silently break auth and App Router route signatures.

Prerequisites for a controlled upgrade:
1. Token-opaque browser auth BFF must pass real authenticated E2E with a dedicated test tenant.
2. Build must pass on the target Next.js version, including server actions, admin/Company/R&D route guards, middleware/proxy migration, locale routes and image loading.
3. Migrate `cookies()`/`headers()` to current async APIs, `next lint` to ESLint CLI, and explicit caching semantics.
4. Audit external packages and eslint-config peer dependencies; promote only after preview deployment smoke and production permission checks.

This is an explicit deferred compatibility migration rather than a claim of completed upgrade.
