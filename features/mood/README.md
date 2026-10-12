# Mood feature slice

New canonical implementation under `features/mood`:

- `api/moodRecord.ts`: typed API calls to NestJS through the common transport;
- `model/mood.helpers.ts`: pure mood aggregation logic;
- `hooks/useMoodStory.ts`: client state / polling for MoodStory;
- `ui/MoodSummaryCard.tsx`: server component composition.

Legacy imports remain available as **re-export compatibility shims**, so migration does not break existing routes or tests. New mood code should import directly from `@/features/mood/*`. Do not move all MoodTracker components in one PR.

Layering: app route → feature UI/hook → feature API/model → shared transport. A feature may depend on shared `lib`/`ui`/`ds`, but should not import another feature's internal files.
