import { NextResponse } from 'next/server'

import { getServerSessionStrict } from '@/lib/auth/server'
import { getMoodRecords } from '@/requests/moodRecord'
import type { MoodRecordEntity } from '@/types/api-responses'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 100
const MAX_ENTRIES = 10_000

function privateResponse(body: unknown, status: number) {
  return NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': 'private, no-store, max-age=0',
      'X-Content-Type-Options': 'nosniff',
      Vary: 'Cookie',
    },
  })
}

/**
 * Export personal mood check-ins only. Not a whole-account/GDPR erasure
 * endpoint; never expose or request any other user's identifier.
 *
 * Pagination is fail-closed: a failed page, ambiguous duplicate, or history
 * larger than the supported range never produces a partial download.
 */
export async function GET(): Promise<NextResponse> {
  try {
    const session = await getServerSessionStrict()
    if (!session?.user?.id) return privateResponse({ error: 'Unauthorized' }, 401)

    const entries: Array<
      Pick<MoodRecordEntity, 'id' | 'moodLevel' | 'stressLevel' | 'energyLevel' | 'focusLevel' | 'tags' | 'createdAt'>
    > = []
    const seen = new Set<string>()
    for (let page = 1; page <= MAX_ENTRIES / PAGE_SIZE + 1; page += 1) {
      const result = await getMoodRecords(session, { page, limit: PAGE_SIZE, order: 'oldest' })
      if ('error' in result) return privateResponse({ error: 'Mood history export is temporarily unavailable' }, 502)
      const records = result.data.moodNotes
      if (!Array.isArray(records) || records.length > PAGE_SIZE) {
        return privateResponse({ error: 'Mood history export could not be verified' }, 502)
      }
      for (const item of records) {
        if (!item.id || seen.has(item.id)) {
          return privateResponse({ error: 'Mood history changed during export; retry' }, 409)
        }
        if (entries.length >= MAX_ENTRIES) {
          return privateResponse({ error: 'History exceeds the download limit; request a full data export' }, 413)
        }
        seen.add(item.id)
        entries.push({
          id: item.id,
          moodLevel: item.moodLevel,
          stressLevel: item.stressLevel,
          energyLevel: item.energyLevel,
          focusLevel: item.focusLevel,
          tags: item.tags ?? [],
          createdAt: item.createdAt,
        })
      }
      // Always read until a short page: missing pagination headers must never
      // silently truncate a full 100-record page.
      if (records.length < PAGE_SIZE) break
    }

    const exportedAt = new Date().toISOString()
    const filename = `dzvin-mood-history-${exportedAt.slice(0, 10)}.json`
    return new NextResponse(JSON.stringify({ format: 'dzvin-mood-history', version: 1, exportedAt, entries }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'private, no-store, max-age=0',
        'X-Content-Type-Options': 'nosniff',
        Vary: 'Cookie',
      },
    })
  } catch {
    return privateResponse({ error: 'Session or export service temporarily unavailable' }, 503)
  }
}
