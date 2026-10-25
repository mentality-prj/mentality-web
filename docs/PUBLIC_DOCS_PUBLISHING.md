# Public documentation publishing policy

Public content lives **only** in `content/public-docs/{uk,en,pl}.json`, rendered at `/{locale}/docs` and `/{locale}/docs/{slug}`.

- Publish manually authored, externally verified, user-visible behaviours only.
- **Never** import or automatically generate public pages from private QDIP runtime, private architecture, issue trackers, prompts, confidential specifications, nonpublic grant evidence or private API contracts. Publicly released scientific material may inform manually authored, independently reviewed high-level descriptions when accurately cited; no secrets or unpublished implementation may be exposed.
- Do not publish credentials, hidden endpoints, model weights, customer details, internal performance/costs or unreleased features.
- Require human IP, privacy, product and translation review before material external claims are introduced. Automated forbidden-term tests are not a substitute for human review.
- Do not inject generic disclaimer banners or internal selling instructions into public content. State only relevant, specific product limitations and evidence boundaries where a claim needs context.
- Keep internal sales battlecards, PO acceptance checklists, unpublished pricing, private customer cases and conversion analysis outside this **public** repository. The public site must show buyer-facing product information only.
- Public claims must be grounded in supported product workflows. Do not fabricate ROI, outcomes, statistics, named-competitor rankings or authenticated-product screenshots.
- Verify typecheck, lint, tests, build and HTTP status of all locale routes in preview before production.
- Changes to legal promises or clinical claims need subject-matter approval.

## Custom hostname

- Vercel domain: `docs.dzvin.co` attached to the existing `mentality-web` project.
- External DNS is hosted by Porkbun; add `CNAME docs → 04fe66d2fbb05c60.vercel-dns-017.com` there (only after verifying the value shown in Vercel Domain settings).
- The Next.js proxy only permits `/{uk,en,pl}/docs*` on the docs hostname. Other public routes redirect to `www.dzvin.co`; API and OAuth callback routes return 404.
- Public docs routes must be present in the proxy's public-route allowlist and bypass expired-session redirects.
- Canonical URLs point to the documentation hostname after the domain is live.
- Merge requires green CI and explicit IP/privacy review. The documentation subdomain must **not** be announced as live until external DNS, HTTPS and anonymous HTTP access have been verified. The main site can expose `/{locale}/docs` first.

## Presentation and lead journey

- Public presentations at `/{locale}/docs/decks/{teams,individuals,research}` must contain only verified descriptions of user-visible workflows and no private datasets.
- Presentation slides support browser print-to-PDF; do not label illustrative artwork as actual product screenshots.
- Demo CTAs link to the main site's existing contact form with whitelisted `source=docs&intent=demo&segment=...` attribution; the backend receives source information as part of the message.
- The financial calculator uses explicitly entered assumptions, with no preselected positive effect or invented commercial price.
- The SEO sitemap contains locale-aware docs and deck URLs; avoid exposing protected account routes as indexed pages.

## Pre-launch funding dossier policy (2026-10-25)

- Target audience: funders, investors, reviewers, scientific collaborators; separate investor and research-grant presentations from buyer product decks.
- Dzvin is in development. There are no commercial customers, verified live pilots, or clinical outcome evidence. Never substitute CI, mock tests or deployed documentation for verified effectiveness.
- QDIP is discussed as a separate research direction and potential DI-enabling technology. Scientific novelty is a falsifiable claim, not demonstrated superiority.
- Stage statements should reference the dated product roadmap and release-gate issues, while links to public primary literature support the research context.
- Fundraising budget remains unpriced by default. Include only confirmed amounts with provenance and a call-specific work plan; TRL and completion dates require specific evidence.
- Keep internal PO/CMO objection handling, private costs, team biographies not approved for release, uncommitted partner names and proprietary implementation outside this public repository.
- Investor/fund CTAs must use the approved contact path with whitelisted query parameters, never accept open redirect or raw message content from URL parameters.
