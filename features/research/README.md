# Research domain

Source entry points: `api/researchProjects.ts` and `ui/ResearchStateCard.tsx`.
Domain normalization and payload mapping now live under `model/`, while company lookups, workspace request coalescing and HTTP orchestration stay in `api/researchProjects.ts`.

All exported API functions and existing imports are preserved through compatibility re-exports. The shared `ApiResult<T>` contract propagates upstream HTTP statuses without changing success response shapes. The API boundary check disallows model dependencies on transport and UI.
