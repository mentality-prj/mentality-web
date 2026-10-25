# Dzvin.co public documentation — editorial standard

**Audience:** corporate innovation committees, investors, grant evaluators, scientific partners, product leadership.
**Project stage:** software in development; field outcomes, customer traction and scientific effectiveness are not established.
**Applies to:** `content/public-docs/{uk,en,pl}.json`, funding and product decks, document navigation, page descriptions and publication metadata.

## Narrative standard

Write as a technology organisation presenting a research-backed project, not as a consumer sales landing page or an internal implementation ticket. Each claim should fit one of these evidence classes:

1. **Product vision** — intended use or proposed capability, stated as a target.
2. **Engineering artifact** — implemented code/component, supported by a verifiable repository reference and scope.
3. **Qualified capability** — validated integration with actual environment, auth/security coverage and reproducible E2E evidence.
4. **Research finding** — completed methodology and analysis with defined dataset, uncertainty and limitations.
5. **Commercial outcome** — actual signed/paying customer or measured market result supported by an approved source.

Never silently upgrade an artifact to a qualified capability, research result or commercial outcome. The absence of pilot results belongs in the readiness/evidence section; it should not be repeated defensively on every slide.

## Corporate writing requirements

- Lead with **strategic context → differentiated hypothesis → available technology → delivery programme → qualification criteria → partnership**.
- Provide concrete roles, work packages, acceptance gates and source references where appropriate.
- Preserve the distinction between **QDIP / Decision Intelligence as a research approach** and an independently verified advantage in mental wellbeing.
- Explain scientific novelty as an investigation of a specific composition and evaluation, not ownership of already-known approaches or proven clinical outcomes.
- Keep the five development-roadmap phases and **four WP1–WP4 delivery packages** consistent in every language and pitch deck.
- Use professional declarative titles and summaries. Do not use apologetic headings, fabricated ROI, invented sales, rhetorical excuses, unsupported superiority or direct requests to an investor to build our budget.
- Keep legal/privacy facts grounded in the actual published policy; don't add clinical or compliance guarantees unsupported by review.
- Treat published source links and issue status as time-sensitive: revalidate before describing them as current or completed.
- Fully localize section categories and audience copy to UK/EN/PL. Preserve QDIP, Decision Intelligence, accepted product names and official regulatory/model names; translate incidental English jargon.
- Article **title, category, summary and body** must describe the same scope. A removed calculator or demo must be removed from all summaries, links and decks.

## Release checklist

- Review every changed section in **all three languages**, including landing text, article metadata and pitch decks.
- Compare product maturity, scientific claims and milestone names across investor deck, research deck and the evidence register.
- Run unit, TypeScript, ESLint, Prettier and Next.js production build; verify all localized routes and sources.
- Never modify Dzvin.co visual components, CSS, global design tokens or branding during a content-only request.
- Publish only after CI passes and verify the actual production domain. Do not describe an unrun visual/mobile QA as completed.
