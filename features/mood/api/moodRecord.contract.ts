import { z } from 'zod'

import type { MoodRecordEntity } from '@/types/api-responses'

// Decode untrusted NestJS JSON once at the feature boundary. A malformed
// response is a contract failure, not a valid empty mood history.
const moodRecordSchema = z
  .object({
    id: z.string().min(1),
    moodLevel: z.number().finite().optional(),
    stressLevel: z.number().finite(),
    energyLevel: z.number().finite(),
    focusLevel: z.number().finite(),
    tags: z.array(z.string()).optional(),
    createdAt: z.string().optional(),
  })
  .passthrough()

const moodRecordListSchema = z.array(moodRecordSchema)

export function decodeMoodRecord(value: unknown): MoodRecordEntity | null {
  const result = moodRecordSchema.safeParse(value)
  return result.success ? result.data : null
}

export function decodeMoodRecordList(value: unknown): MoodRecordEntity[] | null {
  const result = moodRecordListSchema.safeParse(value)
  return result.success ? result.data : null
}
