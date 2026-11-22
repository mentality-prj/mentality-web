import { MAX_API_ARRAY_ITEMS } from '@/constants/apiValidation'

import { decodeMoodRecordList, decodeMoodRecordListResponse } from './moodRecord.contract'

describe('Mood record list contract', () => {
  it('accepts a valid empty history', () => {
    expect(decodeMoodRecordList([])).toEqual([])
  })

  it('rejects oversized mood histories', () => {
    const oversized = Array.from({ length: MAX_API_ARRAY_ITEMS + 1 }, (_, index) => ({
      id: `record-${index}`,
      stressLevel: 2,
      energyLevel: 3,
      focusLevel: 4,
    }))
    expect(decodeMoodRecordList(oversized)).toBeNull()
    expect(decodeMoodRecordListResponse(oversized)).toEqual({
      success: false,
      error: 'Invalid mood record response from backend',
    })
  })

  it('rejects oversized nested tag arrays', () => {
    expect(
      decodeMoodRecordList([
        {
          id: 'record-1',
          stressLevel: 2,
          energyLevel: 3,
          focusLevel: 4,
          tags: Array(MAX_API_ARRAY_ITEMS + 1).fill('tag'),
        },
      ])
    ).toBeNull()
  })
})
