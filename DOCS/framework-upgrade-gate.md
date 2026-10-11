# Next.js framework upgrade qualification

## Implementation status (2026-10-11)

**TECHNICAL CI PASS — PRODUCTION AUTH E2E PENDING**

The `mentality-web` frontend has been migrated on PR #437 from Next.js 14 / React 18 to:

- Next.js 16.4.0 and React/ReactDOM 19.3.0
- next-intl 4 and ESLint 9 flat configuration
- Node.js 22 CI runtime, updated Yarn 1 lockfile
- asynchronous `cookies()` and `headers()` in Server Components, routes and actions
- Next.js 16 `proxy.ts` replacing `middleware.ts`, including corresponding regression tests
- ESLint CLI replacing `next lint`, Next route type generation and Webpack production build gate
- Jest transpilation of ESM-only next-intl dependencies

### Automated evidence

Commit `1407ce0813b7dd4c000bdaafdfefde9d8e48554f`, workflow run `38098555623`:

- TypeScript — PASS
- ESLint 9 — PASS
- Prettier — PASS
- Jest — PASS (86 suites; 641 tests passed, 1 skipped)
- Anonymous HTTP smoke harness — PASS
- `next build --webpack` — PASS
- Vercel deployment status — success

## Release qualification still required

The above is technical CI evidence, **not** proof that the new authentication boundary works in production.

Before merging PR #437 into `dev` or promoting to production:

1. Execute authenticated browser E2E with dedicated Zitadel application/account and NestJS test tenant, see #439.
2. Verify PKCE login callback, refresh rotation/concurrency, hard reload, logout, permissions for admin/company/research and cross-tenant isolation.
3. Verify no sensitive token leaks through browser JSON, response headers or client-side logs.
4. Check protected SSR navigation, B2C data isolation, locale redirects and security headers in the Vercel preview.
5. Assess bundle and Core Web Vitals against the prior production baseline before release.

Do not mark issue #438 release-qualified until these external checks pass. Do not bypass #439 simply because the mocked unit tests pass.
