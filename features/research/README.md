# Research domain

Source entry points: `api/researchProjects.ts` and `ui/ResearchStateCard.tsx`.
Domain normalization and payload mapping now live under `model/`, while company lookups, workspace request coalescing and HTTP orchestration stay in `api/researchProjects.ts`.

All exported API functions and existing imports are preserved through compatibility re-exports. The shared `ApiResult<T>` contract propagates upstream HTTP statuses without changing success response shapes. The API boundary check disallows model dependencies on transport and UI.

Collection endpoints now decode the array or documented list aliases before normalization. Missing and invalid lists or individual records return a typed 502 contract failure rather than an empty success. Workspace access accepts explicitly typed entitlement-only responses, but rejects empty or malformed objects; existing backend 403 handling remains unchanged.

Single-project reads/writes and grant creation now validate their response identity at the Research feature API boundary. Invalid 2xx entity payloads yield status 502 rather than success-shaped placeholder objects or random grant IDs. The private request adapter accepts raw `unknown` JSON and does not assert a generic response type; existing public API signatures remain unchanged.

Shared `performAuthRequest` now supports opt-in `decodeResponse` validators at the HTTP boundary. Project detail reads use a decoder to turn malformed HTTP 2xx JSON into a typed 502 before domain mapping, while preserving 403/401 responses. This is an incremental migration: legacy callers that omit `decodeResponse` retain their existing (unvalidated) response behavior.

Project, member and grant collections now use tagged decoders passed to shared `performAuthRequest`. List envelopes and individual identities are checked before domain projection, and member/grant ViewModels are normalized exactly once within the decoder. `requests/researchProjects.test.ts` exercises real `genericFetch` against a mocked lower-level HTTP adapter, including 403/503 propagation. Audit/workspace and mutation paths keep their existing contracts pending separate migration.

Research mutation responses (project create/update, member add, grant create) and audit history now use tagged decoders at the shared `performAuthRequest` boundary. Successful DTOs are projected once, while invalid 2xx results yield controlled 502 errors without invented entities. Existing HTTP error statuses and audit alias shapes are retained; workspace/cohort/export normalization remains for later migrations.
