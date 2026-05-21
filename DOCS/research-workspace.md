# Research Workspace & Reporting Guide

Generated: 2026-05-19

---

## Overview

The Research Workspace introduces a dedicated authenticated area for governed research projects, cohort management, grants, export requests, ML inspection, and audit history.

It is separate from the legacy admin and company dashboards and uses a standalone request layer backed by `research/v1` endpoints.

This feature set is complemented by new reporting workspaces for manager decision support, company/admin diagnostics, and personal risk dashboards.

---

## Access Model

Research access is derived from `getResearchWorkspaceAccess()` in `requests/researchProjects.ts`.

The workspace is available when the backend grants one of these research capabilities, and the platform `admin` role also has full access:

- `scientist`
- `research_admin`

`canCreateProjects` is computed from the returned capabilities, company scope, and the platform `admin` role.

The protected app layout uses this access result to decide whether the Research entry appears in the authenticated navigation.

---

## Route Structure

All user-facing research pages live under `app/[locale]/(protected)/research/`.

| Path                                        | Purpose                                    |
| ------------------------------------------- | ------------------------------------------ |
| `/research`                                 | Redirects to the research projects index   |
| `/research/projects`                        | Lists accessible research projects         |
| `/research/projects/create`                 | Creates a new research project             |
| `/research/projects/:projectId`             | Redirect target for project sub-navigation |
| `/research/projects/:projectId/dashboard`   | Project metadata and overview              |
| `/research/projects/:projectId/members`     | Member management                          |
| `/research/projects/:projectId/cohort`      | Cohort configuration                       |
| `/research/projects/:projectId/grants`      | Grant management                           |
| `/research/projects/:projectId/diagnostics` | ML inspection                              |
| `/research/projects/:projectId/datasets`    | History dataset browser                    |
| `/research/projects/:projectId/exports`     | Export requests and inline download        |
| `/research/projects/:projectId/audit`       | Audit trail                                |

`app/[locale]/(protected)/research/layout.tsx` is the server-side entry point for access checks and workspace navigation.

---

## UI Building Blocks

Research UI reuses shared project primitives instead of introducing a separate design language.

Key feature components:

- `components/features/Research/ResearchWorkspaceMenu.tsx`
- `components/features/Research/ResearchProjectInnerMenu.tsx`
- `components/features/Research/ResearchStateCard.tsx`
- `components/features/Research/ResearchProjectsList.tsx`
- `components/features/Research/CreateResearchProjectForm.tsx`
- `components/features/Research/ResearchProjectOverview.tsx`
- `components/features/Research/ResearchProjectMembersPanel.tsx`
- `components/features/Research/ResearchProjectCohortPanel.tsx`
- `components/features/Research/ResearchProjectGrantsPanel.tsx`
- `components/features/Research/ResearchProjectMLInspectionPanel.tsx`
- `components/features/Research/ResearchProjectHistoryDatasetPanel.tsx`
- `components/features/Research/ResearchProjectExportsPanel.tsx`
- `components/features/Research/ResearchProjectAuditPanel.tsx`

These components intentionally reuse `StaticCard`, `DashboardItem`, `InnerMenu`, and the existing `Button/Input/Select/Badge/Switch` UI primitives.

---

## Request Layer

The canonical frontend integration for research APIs lives in `requests/researchProjects.ts`.

It provides:

- workspace access discovery
- project list and project details
- create/update project mutations
- member CRUD operations
- cohort read/update
- grants read/create
- ML inspection queries
- history dataset retrieval
- export request handling
- audit trail retrieval

Normalization is intentionally tolerant to backend response shape drift. Shared domain types live in `types/research.ts`.

---

## Localization

Research copy is defined in:

- `messages/en/pages/Research.json`
- `messages/uk/pages/Research.json`
- `messages/pl/pages/Research.json`

Client components use `useTranslations('pages.Research')` and server routes use `getTranslations('pages.Research')`.

When adding new labels or panel states, update all three locale files in the same change.

---

## Testing

Current automated coverage for the new research/reporting functionality is split by layer:

- `requests/researchProjects.test.ts` validates the `research/v1` request layer and normalization
- `components/features/Research/ResearchProjectsList.test.tsx` covers safe fallback rendering for dates and unknown statuses
- `app/[locale]/(protected)/research/layout.test.tsx` covers workspace access gating
- `app/[locale]/(protected)/research/projects/page.test.tsx` covers the projects index route states
- `components/features/Company/Manager/DecisionSupport/DecisionSupportWorkspace.test.tsx` covers reporting workspace composition and scope selection
- `helpers/reportingMappers.test.ts` and `helpers/reportingVisibility.test.ts` cover reporting transformation and presentation policy rules
- `requests/decisionSupport.test.ts` covers reporting/decision-support request behavior

---

## Related Reporting Surfaces

The same delivery also added or reshaped reporting-focused workspaces outside the research tree:

- `/company/manager/decision-support`
- `/company/admin/diagnostics`
- `/admin/r-and-d`
- `/admin/r-and-d/diagnostics`
- `/my-progress/statistics`

Primary implementation files:

- `components/features/Company/Manager/DecisionSupport/DecisionSupportWorkspace.tsx`
- `components/features/Company/Manager/DecisionSupport/RiskEventsFeed.tsx`
- `components/features/Statistics/PersonalRiskDashboard.tsx`
- `components/shared/reporting/ReportingPrimitives.tsx`
- `requests/reportingClient.ts`
- `helpers/reportingMappers.ts`
- `helpers/reportingVisibility.ts`

These surfaces share the same reporting domain types from `types/reporting.ts`.
