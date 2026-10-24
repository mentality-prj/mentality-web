# Public documentation publishing policy

Public content lives **only** in `content/public-docs/{uk,en,pl}.json`, rendered at `/{locale}/docs` and `/{locale}/docs/{slug}`.

- Publish manually authored, externally verified, user-visible behaviours only.
- **Never** import or generate pages from QDIP source, internal architecture, issue trackers, prompts, confidential specifications, grant evidence or private API contracts.
- Do not publish credentials, hidden endpoints, model weights, customer details, internal performance/costs or unreleased features.
- Require human IP, privacy, product and translation review before merge. Automated forbidden-term tests are not a substitute for human review.
- Use clear disclaimers about medical limitations, access restrictions and uncertainty.
- Verify typecheck, lint, tests, build and HTTP status of all locale routes in preview before production.
- Changes to legal promises or clinical claims need subject-matter approval.
