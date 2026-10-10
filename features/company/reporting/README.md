# Company reporting domain

Canonical source now lives under `features/company/reporting`:
- `api/reportingClient.ts`: NestJS reporting projections and DTO normalization.
- `model/reportingMappers.ts`: domain projection → presentation view model.
- `model/reportingCopy.ts`: reporting vocabulary and locale decisions.
- `hooks/useReportOverview.ts`: client-side loading state.
- `ui/RiskEventsFeed.tsx`: operational reporting UI.

Legacy paths are re-export shims; they remain while consumers are migrated. All server-side access continues through backend RBAC and the browser BFF.
