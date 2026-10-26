import type { MoodRecordEntity } from '@/types/api-responses'

import { chooseMoodNextStep, MOOD_ACTION_HREF } from './moodNextStep'

const base: MoodRecordEntity = {
  id: 'private-user-record',
  moodLevel: 3,
  stressLevel: 3,
  energyLevel: 3,
  focusLevel: 3,
  createdAt: '2026-10-17T10:00:00.000Z',
  tags: ['private-tag'],
}

describe('transparent, non-predictive next action', () => {
  it('prioritizes breathing for high self-reported stress', () => {
    expect(chooseMoodNextStep({ ...base, stressLevel: 4 })).toEqual({
      observation: 'stress',
      action: 'breathing',
      href: '/guide/breathing',
      level: 4,
    })
    expect(chooseMoodNextStep({ ...base, stressLevel: 5, moodLevel: 1, energyLevel: 1 }).observation).toBe('stress')
  })

  it('offers calming for low mood when stress is not high', () => {
    expect(chooseMoodNextStep({ ...base, moodLevel: 1, energyLevel: 1, focusLevel: 1 })).toEqual({
      observation: 'mood',
      action: 'calming',
      href: '/guide/calming',
      level: 1,
    })
  })

  it('uses the existing meditations page when low energy is the leading self-report', () => {
    expect(chooseMoodNextStep({ ...base, energyLevel: 2, focusLevel: 1 })).toEqual({
      observation: 'energy',
      action: 'meditation',
      href: '/guide/meditations',
      level: 2,
    })
  })

  it('offers an existing optional focus activity when focus is low', () => {
    expect(chooseMoodNextStep({ ...base, focusLevel: 2 })).toEqual({
      observation: 'focus',
      action: 'focus',
      href: '/mental-games/attention-sprint',
      level: 2,
    })
  })

  it('keeps an optional neutral default and fails closed for invalid levels', () => {
    expect(chooseMoodNextStep(base)).toEqual({
      observation: 'general',
      action: 'breathing',
      href: '/guide/breathing',
    })
    expect(
      chooseMoodNextStep({ ...base, stressLevel: 99, moodLevel: undefined, energyLevel: NaN, focusLevel: 0 })
    ).toEqual({ observation: 'general', action: 'breathing', href: '/guide/breathing' })
    expect(chooseMoodNextStep({ ...base, stressLevel: 4.5, moodLevel: 0 }).observation).toBe('general')
  })

  it('reuses the most recent explicit positive response only for neutral check-ins', () => {
    const feedback = [
      { category: 'focus' as const, helpful: false },
      { category: 'meditation' as const, helpful: true },
      { category: 'calming' as const, helpful: true },
    ]
    expect(chooseMoodNextStep(base, feedback)).toEqual({
      observation: 'preference',
      action: 'meditation',
      href: '/guide/meditations',
    })
    expect(chooseMoodNextStep({ ...base, stressLevel: 5 }, feedback).action).toBe('breathing')
    expect(chooseMoodNextStep({ ...base, moodLevel: 1 }, feedback).action).toBe('calming')
    expect(chooseMoodNextStep({ ...base, energyLevel: 1 }, feedback).action).toBe('meditation')
    expect(chooseMoodNextStep(base, [{ category: 'focus', helpful: false }]).observation).toBe('general')
  })

  it('only returns fixed supported links without private IDs, tags or predictions', () => {
    const result = chooseMoodNextStep({ ...base, focusLevel: 1 })
    expect(Object.values(MOOD_ACTION_HREF)).toEqual([
      '/guide/breathing',
      '/guide/calming',
      '/guide/meditations',
      '/mental-games/attention-sprint',
    ])
    const serialized = JSON.stringify(result)
    expect(serialized).not.toContain(base.id)
    expect(serialized).not.toContain('private-tag')
    expect(serialized).not.toContain('prediction')
    expect(Object.keys(result)).toEqual(['observation', 'action', 'href', 'level'])
  })
})
