import { render, screen } from '@testing-library/react'
import { getTranslations } from 'next-intl/server'

import { MoodNextStepCard } from '@/components/features/Guide/MoodNextStepCard'
import type { MoodRecordEntity } from '@/types/api-responses'

jest.mock('next-intl/server')
jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}))
jest.mock('@/ds/components/SectionCard', () => ({
  SectionCard: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
jest.mock('@/ui/button', () => ({
  Button: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const moodRecord: MoodRecordEntity = {
  id: 'qa-record',
  moodLevel: 3,
  stressLevel: 4,
  energyLevel: 2,
  focusLevel: 3,
}

beforeEach(() => {
  jest.clearAllMocks()
  ;(getTranslations as jest.Mock).mockResolvedValue((key: string, vars?: { level?: number }) => {
    return vars ? `${key}:${vars.level}` : key
  })
})

describe('MoodNextStepCard', () => {
  it('explains observed stress and suggests existing breathing exercises', async () => {
    render(await MoodNextStepCard({ record: moodRecord }))

    expect(getTranslations).toHaveBeenCalledWith('components.ExercisesForRecovery.nextStep')
    expect(screen.getByRole('heading', { name: 'title' })).toBeInTheDocument()
    expect(screen.getByText('observations.stress:4')).toBeInTheDocument()
    expect(screen.getByText('suggestions.breathing')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'actions.breathing' })).toHaveAttribute('href', '/guide/breathing')
    expect(screen.getByText('limitNote')).toBeInTheDocument()
  })

  it('uses the calming library only for a supported low mood observation', async () => {
    render(await MoodNextStepCard({ record: { ...moodRecord, stressLevel: 2, moodLevel: 1 } }))

    expect(screen.getByText('observations.mood:1')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'actions.calming' })).toHaveAttribute('href', '/guide/calming')
  })

  it('makes no prediction or invented observation when values are unusable', async () => {
    render(await MoodNextStepCard({ record: { ...moodRecord, stressLevel: -1, moodLevel: undefined } }))

    expect(screen.getByText('observations.general:0')).toBeInTheDocument()
    expect(screen.queryByText('observations.stress:4')).not.toBeInTheDocument()
    expect(screen.getByText('limitNote')).toBeInTheDocument()
  })
})
