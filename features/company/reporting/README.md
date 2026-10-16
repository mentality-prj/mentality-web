# Company reporting domain

Canonical source now lives under `features/company/reporting`:

- `api/reportingClient.ts`: NestJS reporting transport, error propagation and ViewModel orchestration.
- `model/projections/`: pure overview, risk, ML, personal and team projection mappings.
- `model/reportingMappers.ts`: domain projection → presentation view model.
- `model/reportingCopy.ts`: reporting vocabulary and locale decisions.
- `hooks/useReportOverview.ts`: client-side loading state.
- `ui/RiskEventsFeed.tsx`: operational reporting UI.

Legacy paths are re-export shims; they remain while consumers are migrated. All server-side access continues through backend RBAC and the browser BFF.

Report API calls use the shared `ApiResult<T>` success/error contract and retain upstream HTTP status codes. Model-layer modules cannot import API transports or UI; this dependency direction is checked by `scripts/api-boundary.test.mjs`.
