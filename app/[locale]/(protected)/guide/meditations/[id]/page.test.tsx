import { render, screen } from '@testing-library/react'
import { getLocale, getTranslations } from 'next-intl/server'

import { getExerciseById } from '@/requests/exercises'

import MeditationPage from './page'

jest.mock('next-intl/server', () => ({ getLocale: jest.fn(), getTranslations: jest.fn() }))
jest.mock('@/lib/get-server-session', () => ({
  getServerSession: jest.fn().mockResolvedValue({ user: { id: 'private-user' } }),
}))
jest.mock('@/requests/exercises', () => ({ getExerciseById: jest.fn() }))
jest.mock('@/components/features/Guide/ExerciseFeedback', () => ({
  ExerciseFeedback: ({ category }: { category: string }) => <div>feedback:{category}</div>,
}))
jest.mock('@/components/features/Meditations/OtherMeditations', () => ({
  OtherMeditations: () => <div>other-meditations</div>,
}))
jest.mock('@/components/features/Meditations/StyledDescription', () => ({
  StyledDescription: ({ text }: { text: string }) => <p>{text}</p>,
}))
jest.mock('@/components/shared/Cards/Card', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
jest.mock('@/ds/components/PageTitle', () => ({
  PageTitle: ({ title }: { title: string }) => <h1>{title}</h1>,
}))
jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}))

beforeEach(() => {
  jest.clearAllMocks()
  ;(getLocale as jest.Mock).mockResolvedValue('uk')
  ;(getTranslations as jest.Mock).mockResolvedValue((key: string) => key)
})

const pageParams = { params: Promise.resolve({ id: 'meditation-123' }) }

describe('individual meditation voluntary feedback', () => {
  it('offers the existing category rating only after a valid meditation is loaded', async () => {
    ;(getExerciseById as jest.Mock).mockResolvedValue({
      data: {
        category: 'meditation',
        translations: {
          title: { uk: 'My meditation' },
          annotation: { uk: 'Short exercise' },
          description: { uk: 'Follow the breathing steps' },
        },
      },
    })
    render(await MeditationPage(pageParams))

    expect(getExerciseById).toHaveBeenCalledWith(expect.anything(), 'meditation-123')
    expect(screen.getByRole('heading', { name: 'My meditation' })).toBeInTheDocument()
    expect(screen.getByText('Follow the breathing steps')).toBeInTheDocument()
    expect(screen.getByText('feedback:meditation')).toBeInTheDocument()
    expect(screen.getByText('categoryFeedbackNote')).toBeInTheDocument()
    expect(screen.getByText('other-meditations')).toBeInTheDocument()
  })

  it('does not offer feedback for a missing or unavailable exercise', async () => {
    ;(getExerciseById as jest.Mock).mockResolvedValue({ error: 'Unavailable' })
    render(await MeditationPage(pageParams))

    expect(screen.getByText('somethingWentWrong')).toBeInTheDocument()
    expect(screen.queryByText('feedback:meditation')).not.toBeInTheDocument()
  })

  it('does not rate a mismatched exercise category as meditation', async () => {
    ;(getExerciseById as jest.Mock).mockResolvedValue({ data: { category: 'focus' } })
    render(await MeditationPage(pageParams))

    expect(screen.getByText('notExist')).toBeInTheDocument()
    expect(screen.queryByText('feedback:meditation')).not.toBeInTheDocument()
  })
})
