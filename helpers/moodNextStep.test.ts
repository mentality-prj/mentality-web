import { chooseMoodNextStep } from './moodNextStep'

import type { MoodRecordEntity } from '@/types/api-responses'

const base: MoodRecordEntity = {
  id: 'private-user-record',
  moodLevel: 3,
  stressLevel: 3,
  energyLevel: 3,
  focusLevel: 3,
  createdAt: '2026-10-17T10:00:00.000Z',
  tags: ['private-tag'],
}

describe('explainable, non-predictive next action', () => {
  it('suggests existing breathing exercises when self-reported stress is high', () => {
    const result = chooseMoodNextStep({ ...base, stressLevel: 4 })
    expect(result).toEqual({
      observation: 'stress',
      action: 'breathing',
      href: '/guide/breathing',
      level: 4,
    })
    expect(chooseMoodNextStep({ ...base, stressLevel: 5 }).observation).toBe('stress')
  })

  it('suggests calming for low reported mood, without overriding elevated stress', () => {
    expect(chooseMoodNextStep({ ...base, stressLevel: 3, moodLevel: 2 })).toEqual({
      observation: 'mood',
      action: 'calming',
      href: '/guide/calming',
      level: 2,
    })
    expect(chooseMoodNextStep({ ...base, stressLevel: 4, moodLevel: 1 }).observation).toBe('stress')
  })

  it('keeps a generic optional action for other or insufficient levels', () => {
    expect(chooseMoodNextStep({ ...base, stressLevel: 3, moodLevel: 3 })).toEqual({
      observation: 'general',
      action: 'breathing',
      href: '/guide/breathing',
    })
    expect(chooseMoodNextStep({ ...base, stressLevel: 99, moodLevel: undefined })).toEqual({
      observation: 'general',
      action: 'breathing',
      href: '/guide/breathing',
    })
    expect(chooseMoodNextStep({ ...base, stressLevel: 4.5, moodLevel: 0 }).observation).toBe('general')
  })

  it('does not include private record content, IDs, tags or predicted scores', () => {
    const result = chooseMoodNextStep({ ...base, stressLevel: 5 })
    const serialized = JSON.stringify(result)
    expect(serialized).not.toContain(base.id)
    expect(serialized).not.toContain('private-tag')
    expect(serialized).not.toContain('prediction')
    expect(Object.keys(result)).toEqual(['observation', 'action', 'href', 'level'])
  })
})
