# Dzvin production release reconciliation and rollback — 2026-11-02

## Exact immutable references

| Artifact | Revision | Evidence |
| --- | --- | --- |
| Production Git branch | `50a3530a8cc18fa3aab8852a382ef97beebbc65e` | release merge #591 |
| Dev before reconciliation | `35a923364d370cc9e11c64ae2a53175c043dfc31` | production is 1 commit ahead, file diff empty |
| Current production Vercel deployment | `dpl_HEXPTb7ofycE36faRsEEwfAio6F2` | Vercel state READY on release SHA |
| Previous production deployment | `dpl_D9RR2QsnBfAAdDDTBgtnP9NUQTao` | Vercel state READY, previous SHA `c21324acfcecbf788ecc35425d5d8869c80cecc0` |

Reconciliation **preserves** the production-only release merge commit. The release merge contains no new file changes relative to dev; dropping it or force-resetting production is unnecessary. The PR introducing this document merges production ancestry into dev and adds only this runbook.

## Evidence and scope qualified

- Exact production SHA unit suites (OIDC exchange, AuthProvider refresh, B2C isolation, QDIP admin client): [43/43 PASS](https://github.com/qdip-ai/qdip-e2e/actions/runs/41513320248).
- Source-equivalent dev preview `dpl_6LA11pxMr3TLQ97TZMdgJftY9q9T`: [QA1/QA2 PKCE, two-tab refresh, login/logout, CSRF and responsive E2E PASS](https://github.com/qdip-ai/qdip-e2e/actions/runs/41512915367).
- Production anonymous BFF security and public desktop/portrait/landscape: [PASS](https://github.com/qdip-ai/qdip-e2e/actions/runs/41500537463).
- The production Next.js project must have **server-only** `DZVIN_B2C_ONLY_RELEASE=true` at deployment build time. No QDIP administrator API key belongs in the Next.js B2C project.
- No database migration is introduced by **this ancestry/doc reconciliation**; that is not a statement that all earlier backend releases had no migrations.

## Controlled rollback procedure — NOT REHEARSED

1. Freeze promotion. Confirm the current production alias, deployed SHA, deployment ID, server-only env, backend version, tenant/data migrations and login health. Capture release evidence and incident context.
2. Confirm the candidate rollback deployment `dpl_D9RR2QsnBfAAdDDTBgtnP9NUQTao` still exists and is deployable. Its historical READY state is not current functional verification. Check compatibility with current server env, Zitadel callbacks/cookies and live NestJS contract **before** any alias switch.
3. With release-owner approval, use the Vercel rollback/promote operation to assign the production aliases to that exact prior deployment. Do not force-push or rewrite Git history. If backend schema was upgraded incompatibly, require an independently verified database rollback or forward fix first; do not silently back out data.
4. After alias propagation: exercise public landing/health, same-origin BFF denies, real QA1/QA2 PKCE/login, mood create/read/history on **isolated fixtures**, private cache headers, logout and responsive screenshots. Inspect Vercel/Render errors and identity provider.
5. If acceptance fails, stop and recover the last verified deployment using a new controlled promotion, with incident log and exact timestamps. Record all deployment IDs, observed results, and approvals.

## Release gate still open

This document **does not** prove a production rollback rehearsal or full B2C launch acceptance. Remaining acceptance includes [#439](https://github.com/mentality-prj/mentality-web/issues/439) authenticated ownership/write+teardown, [#322](https://github.com/mentality-prj/mentality-web/issues/322) mood persistence, [#324](https://github.com/mentality-prj/mentality-web/issues/324) nonempty mood history, and [#448](https://github.com/mentality-prj/mentality-web/issues/448) direct server-action / company RBAC denial. Keep [#449](https://github.com/mentality-prj/mentality-web/issues/449) open until rollback is actually rehearsed and post-deploy health/auth/mood evidence is complete.
