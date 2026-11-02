import { createDiaryExport } from './diaryExport'

describe('personal diary data portability', () => {
  it('includes archived and active entries without exposing extra backend fields', () => {
    const notes = [
      { id: 'one', content: 'my note', isActive: false, tags: ['private'], createdAt: '2026-10-17T12:00:00Z' },
      { id: 'two', content: 'archived note', isActive: true, tags: [], internalSecret: 'exclude-me' },
    ]
    const exported = createDiaryExport(notes, '2026-10-18T12:00:00.000Z')
    expect(exported).toEqual({
      format: 'dzvin-diary',
      version: 1,
      exportedAt: '2026-10-18T12:00:00.000Z',
      entries: [
        { id: 'one', content: 'my note', isActive: false, tags: ['private'], createdAt: '2026-10-17T12:00:00Z' },
        { id: 'two', content: 'archived note', isActive: true, tags: [] },
      ],
    })
    expect(JSON.stringify(exported)).not.toContain('exclude-me')
  })

  it('works when the user has no entries', () => {
    expect(createDiaryExport([], '2026-10-18T12:00:00.000Z').entries).toEqual([])
  })
})
