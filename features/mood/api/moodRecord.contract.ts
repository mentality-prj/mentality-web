import { z } from 'zod'

import type { MoodRecordEntity } from '@/types/api-responses'

// Decode untrusted NestJS JSON once at the feature boundary. A malformed
// response is a contract failure, not a valid empty mood history.
const moodScale = z.number().int().min(1).max(5)
const validTimestamp = z.string().refine((value) => !Number.isNaN(new Date(value).getTime()), {
  message: 'Invalid mood record timestamp',
})

const moodRecordSchema = z
  .object({
    id: z.string().min(1),
    moodLevel: moodScale.optional(),
    stressLevel: moodScale,
    energyLevel: moodScale,
    focusLevel: moodScale,
    tags: z.array(z.string()).optional(),
    createdAt: validTimestamp.optional(),
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

const INVALID_MOOD_RESPONSE = 'Invalid mood record response from backend'

/** Tagged decoders let genericFetch distinguish valid empty lists from bad JSON. */
export function decodeMoodRecordResponse(value: unknown) {
  const record = decodeMoodRecord(value)
  return record
    ? { success: true as const, data: record }
    : { success: false as const, error: INVALID_MOOD_RESPONSE }
}

export function decodeMoodRecordListResponse(value: unknown) {
  const records = decodeMoodRecordList(value)
  return records
    ? { success: true as const, data: records }
    : { success: false as const, error: INVALID_MOOD_RESPONSE }
}
