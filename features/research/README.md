# Research domain

Source entry points: `api/researchProjects.ts` and `ui/ResearchStateCard.tsx`.
Domain normalization and payload mapping now live under `model/`, while company lookups, workspace request coalescing and HTTP orchestration stay in `api/researchProjects.ts`.

All exported API functions and existing imports are preserved through compatibility re-exports. The shared `ApiResult<T>` contract propagates upstream HTTP statuses without changing success response shapes. The API boundary check disallows model dependencies on transport and UI.

Collection endpoints now decode the array or documented list aliases before normalization. Missing and invalid lists or individual records return a typed 502 contract failure rather than an empty success. Workspace access accepts explicitly typed entitlement-only responses, but rejects empty or malformed objects; existing backend 403 handling remains unchanged.

Single-project reads/writes and grant creation now validate their response identity at the Research feature API boundary. Invalid 2xx entity payloads yield status 502 rather than success-shaped placeholder objects or random grant IDs. The private request adapter accepts raw `unknown` JSON and does not assert a generic response type; existing public API signatures remain unchanged.

Shared `performAuthRequest` now supports opt-in `decodeResponse` validators at the HTTP boundary. Project detail reads use a decoder to turn malformed HTTP 2xx JSON into a typed 502 before domain mapping, while preserving 403/401 responses. This is an incremental migration: legacy callers that omit `decodeResponse` retain their existing (unvalidated) response behavior.

Project, member and grant collections now use tagged decoders passed to shared `performAuthRequest`. List envelopes and individual identities are checked before domain projection, and member/grant ViewModels are normalized exactly once within the decoder. `requests/researchProjects.test.ts` exercises real `genericFetch` against a mocked lower-level HTTP adapter, including 403/503 propagation. Audit/workspace and mutation paths keep their existing contracts pending separate migration.

Research mutation responses (project create/update, member add, grant create) and audit history now use tagged decoders at the shared `performAuthRequest` boundary. Successful DTOs are projected once, while invalid 2xx results yield controlled 502 errors without invented entities. Existing HTTP error statuses and audit alias shapes are retained; workspace/cohort/export normalization remains for later migrations.

Research Workspace Access uses the same tagged transport decoder as other Research endpoints. Its decoder accepts supported metadata-only and empty-list responses, validates the first-present project identity and workspace/company fields, and rejects malformed HTTP 2xx payloads with 502 before access is computed. Upstream 403 denial/company-boundary behavior and in-flight-only request coalescing are unchanged.

Cohort, History Dataset and Export requests now use tagged runtime decoders in the shared authenticated transport. A genuinely absent cohort stays `null`, an empty history remains `[]`, and valid export states preserve the existing UI projections. Malformed 2xx responses (wrong cohort fields, invalid history rows/totals, or exports lacking a real state/ready content) return 502 instead of silently inventing successful results. Existing request bodies, HTTP error propagation and public API contracts remain unchanged.

The final operational boundary pass rejects unknown export statuses and blank ready content, checks that a dataset total is not smaller than returned rows, and requires meaningful cohort fields (not merely an empty date-range wrapper). ML Inspection now also uses a tagged transport decoder: explicit `null` stays absent, known nonempty inspection fields are validated, and malformed 2xx JSON yields 502. Existing request parameters and upstream HTTP errors are unchanged.
