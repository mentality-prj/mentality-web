# Public documentation publishing policy

Public content lives **only** in `content/public-docs/{uk,en,pl}.json`, rendered at `/{locale}/docs` and `/{locale}/docs/{slug}`.

- Publish manually authored, externally verified, user-visible behaviours only.
- **Never** import or generate pages from QDIP source, internal architecture, issue trackers, prompts, confidential specifications, grant evidence or private API contracts.
- Do not publish credentials, hidden endpoints, model weights, customer details, internal performance/costs or unreleased features.
- Require human IP, privacy, product and translation review before merge. Automated forbidden-term tests are not a substitute for human review.
- Use clear disclaimers about medical limitations, access restrictions and uncertainty.
- Verify typecheck, lint, tests, build and HTTP status of all locale routes in preview before production.
- Changes to legal promises or clinical claims need subject-matter approval.

## Custom hostname

- Vercel domain: `docs.dzvin.co` attached to the existing `mentality-web` project.
- External DNS is hosted by Porkbun; add `CNAME docs → 04fe66d2fbb05c60.vercel-dns-017.com` there (only after verifying the value shown in Vercel Domain settings).
- The Next.js proxy only permits `/{uk,en,pl}/docs*` on the docs hostname. Other public routes redirect to `www.dzvin.co`; API and OAuth callback routes return 404.
- Public docs routes must be present in the proxy's public-route allowlist and bypass expired-session redirects.
- Canonical URLs point to the documentation hostname after the domain is live.
- Domain DNS and HTTPS must be verified before merging the release. No promotion without green CI and IP review.
