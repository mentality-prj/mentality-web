import type { DiaryEntity } from '@/types/api-responses'

/**
 * Explicitly serialize only personal journal fields, including archived entries.
 * Excludes backend/internal metadata and avoids sending the export to any API.
 */
export function createDiaryExport(notes: DiaryEntity[], exportedAt = new Date().toISOString()) {
  return {
    format: 'dzvin-diary',
    version: 1,
    exportedAt,
    entries: notes.map(({ id, content, tags, isActive, createdAt, updatedAt }) => ({
      id,
      content,
      tags: tags ?? [],
      isActive: Boolean(isActive),
      ...(createdAt ? { createdAt } : {}),
      ...(updatedAt ? { updatedAt } : {}),
    })),
  }
}
