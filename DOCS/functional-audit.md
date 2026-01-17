# Functional Audit — Mentality Web

Generated: 2026-01-17

Summary

- Scope: all public, protected, and admin pages; key components and hooks; API endpoints used; mapper/helper coverage.
- Purpose: provide a complete checklist of implemented functionality, what calls backend, what is mocked, and what is purely UI.

---

## Public (UI-focused)

- `/[locale]/(public)/page` (Landing)
  - Components: `HeroSection`, `FeatureCardsSection`, `ServicesSection`, `HowItWorksSection`
  - API: none (static content)
  - Type: ui

- `/[locale]/(public)/services` (Services)
  - Components: Services page UI
  - API: none
  - Type: ui

- `/[locale]/(public)/faq` (FAQ)
  - Components: FAQ UI
  - API: none
  - Type: ui

- `/[locale]/(public)/(auth)/signin` (Sign in)
  - Components: `SignInButton` for providers
  - API: `next-auth` provider flows
  - Type: auth

## Protected (requires auth; connects to backend)

- Guide pages (`/guide/meditations`, `/guide/breathing`, `/guide/calming`)
  - Components: `GuideMeditationsClient`, `GuideCalmingClient`, `GuideBreathingClient`, `ExerciseCard`, `FavoriteButtonWrapper`
  - API: `fetchExercisesItems` → `requests/exercises.fetchExercisesItems` → uses `getExercises` → maps via `helpers/exerciseMapper`
  - Type: api, ui, mapper

- Tips & Affirmations (Daily lists, History)
  - Components: `DailyTipClient`, `TipsList`, `DailyAffirmationClient`, `AffirmationsList`
  - API: `getTips`, `getUnpublishedTips` (requests/tips), `getAffirmations` (requests/affirmations)
  - Type: api, ui

- Mood Tracker / Summary views
  - Components: `TenDaysSummary/*`, `TodayObservations`, `StressLevel`, `MoodMarks`, `BestDay`
  - API: `requests/summary` endpoints (getMoodMarks, getStressLevel, getBestDay, getTodayObservations)
  - Type: api, ui

- My Notes / My Progress / My Day
  - Components: various note lists, saved lists, and charts
  - API: `requests/diary`, `requests/summary`, `requests/affirmations`, `requests/tips` as needed
  - Type: api, ui

- Favorites / Saved
  - Components: `FavoriteButton`, `FavoriteButtonWrapper`
  - API: `toggleFavoriteWithSession` → `requests/favorites`
  - Type: api, ui

## Admin (full CRUD + admin-only endpoints)

- Admin root: `/[locale]/admin`
  - Renders admin sections via `components/Admin/index`

- Admin Tags
  - Components: `AddTag`, `DeleteTag` (admin helper components)
  - API: `getTags`, `addTag`, `deleteTag` → `requests/tags`
  - Type: api, ui

- Admin Tips
  - Components: `AddTip`, `PublishTipButton`, `DeleteTipButton`
  - API: `addTip`, `publishTip`, `deleteTip` → `requests/tips`
  - Type: api, ui

- Admin Affirmations
  - Components: `AddAffirmation`, `PublishAffirmationButton`, `DeleteAffirmationButton`
  - API: `addAffirmation`, `publishAffirmation`, `deleteAffirmation` → `requests/affirmations`
  - Type: api, ui

- Admin Exercises (AddExercise)
  - Components: `AddExercise` (tabs: `unpublished` / `corrected`), `AddExerciseForm`, `GenerateExercise`, `ExercisesListClient`, `PublishExerciseButton`, `DeleteExerciseButton`, `EditExerciseButton`, `ExerciseCard`
  - API: `getUnpublishedExercises`, `getCorrectedExercises`, `getExercises`, `addExercise`, `updateExercise`, `deleteExercise`, `publishExercise`, `generateExercise` → `requests/exercises`
  - Mapper: responses pass through `helpers/exerciseMapper.mapExercises` to sanitize objects
  - Type: api, ui, mapper

## Shared components / utilities

- Tabs primitives: `ds/shadcn/tabs.tsx`
  - Provides `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` with a `grey` variant and TypeScript fixes
  - Type: ui, helper

- Pagination: `components/Pagination` used by lists (exercises, tips, etc.)
  - Type: ui

- Helpers/Requests
  - `helpers/exerciseMapper.ts` — new sanitizer mapper (mapExercise, mapExercises)
  - `helpers/apiRequestWithAuth`, `requests/genericFetch` — underlying request helpers used by all `requests/*`
  - Type: helper, api

## Mocks / Tests

- `REST/mockApi.ts` exists (local mock server utilities). Some earlier temporary mocks for corrected exercises were removed; corrected exercises now requested from real backend.
- `__tests__` contains unit tests for select requests and components; mocks exist in `__mocks__`.

## Recommendations / Next checks

- Run full TypeScript check + lint + tests to verify the mapper and tab type changes. (Not executed here.)
- Validate `GET /exercises/corrected` responses against `helpers/exerciseMapper` contract (translations object shape).
- Optionally consolidate `TabsList` container styles into `variant="grey"` to avoid repeated `className` on each usage.

---

If you want, I can also export a machine-friendly JSON and GH issues file (grouped and labelled). I will generate those next as requested.
