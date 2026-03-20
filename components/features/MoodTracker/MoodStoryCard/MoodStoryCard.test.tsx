import { render, screen } from '@testing-library/react'
import { getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import { MoodStoryCard } from '@/components/features/MoodTracker/MoodStoryCard/MoodStoryCard'
import { resolveActionRoute } from '@/helpers/moodStory.helpers'
import { getLatestMoodStory } from '@/requests/moodStory'
import { MoodStoryScreenEntity } from '@/types/api-responses'
import { CustomSession } from '@/types/auth'

jest.mock('@/auth', () => ({ auth: jest.fn() }))
jest.mock('@/requests/moodStory', () => ({ getLatestMoodStory: jest.fn() }))
jest.mock('next-intl/server')

jest.mock('@/components/shared/Cards/Card', () => ({
  __esModule: true,
  default: ({ children, title }: { children?: React.ReactNode; title?: React.ReactNode }) => (
    <div>
      {title && <h3>{title}</h3>}
      {children}
    </div>
  ),
}))

jest.mock('@/components/features/MoodTracker/MoodStoryCard/MoodStoryNavigator', () => ({
  MoodStoryNavigator: ({ screens }: { screens: MoodStoryScreenEntity[] }) => (
    <div data-testid="mood-story-navigator">{screens.length} screens</div>
  ),
}))

jest.mock('@/components/features/MoodTracker/MoodStoryCard/StoryNotReady', () => ({
  StoryNotReady: () => <div data-testid="story-not-ready" />,
}))

jest.mock('@/components/features/MoodTracker/MoodStoryCard/StoryError', () => ({
  StoryError: () => <div data-testid="story-error" />,
}))

const mockSession: CustomSession = {
  user: { email: 'user@test.com', role: 'user' as const },
  OAuthToken: 'mock-token',
  expires: new Date(Date.now() + 86400000).toISOString(),
}

const mockScreens: MoodStoryScreenEntity[] = [
  {
    title: { en: 'Screen 1', uk: 'Екран 1', pl: 'Ekran 1' },
    text: { en: 'First screen text', uk: 'Текст першого екрану', pl: 'Tekst pierwszego ekranu' },
  },
  {
    title: { en: 'Screen 2', uk: 'Екран 2', pl: 'Ekran 2' },
    text: { en: 'Second screen text', uk: 'Текст другого екрану', pl: 'Tekst drugiego ekranu' },
    action: 'Explore exercises',
  },
]

beforeEach(() => {
  jest.clearAllMocks()
  ;(auth as jest.Mock).mockResolvedValue(mockSession)
  ;(getTranslations as jest.Mock).mockResolvedValue((key: string) => key)
})

describe('MoodStoryCard', () => {
  describe('when API returns a 404 error (story not yet generated)', () => {
    it('renders StoryNotReady inside a Card', async () => {
      ;(getLatestMoodStory as jest.Mock).mockResolvedValue({ error: 'Not Found', status: 404 })

      render(await MoodStoryCard())

      expect(screen.getByTestId('story-not-ready')).toBeInTheDocument()
      expect(screen.queryByTestId('story-error')).not.toBeInTheDocument()
      expect(screen.queryByTestId('mood-story-navigator')).not.toBeInTheDocument()
    })

    it('renders the card title', async () => {
      ;(getLatestMoodStory as jest.Mock).mockResolvedValue({ error: 'Not Found', status: 404 })

      render(await MoodStoryCard())

      expect(screen.getByRole('heading', { name: 'title' })).toBeInTheDocument()
    })
  })

  describe('when API returns a non-404 error', () => {
    it('renders StoryError inside a Card for a 500 error', async () => {
      ;(getLatestMoodStory as jest.Mock).mockResolvedValue({ error: 'Internal Server Error', status: 500 })

      render(await MoodStoryCard())

      expect(screen.getByTestId('story-error')).toBeInTheDocument()
      expect(screen.queryByTestId('story-not-ready')).not.toBeInTheDocument()
      expect(screen.queryByTestId('mood-story-navigator')).not.toBeInTheDocument()
    })

    it('renders StoryError inside a Card when error has no status', async () => {
      ;(getLatestMoodStory as jest.Mock).mockResolvedValue({ error: 'Network error' })

      render(await MoodStoryCard())

      expect(screen.getByTestId('story-error')).toBeInTheDocument()
      expect(screen.queryByTestId('story-not-ready')).not.toBeInTheDocument()
    })

    it('renders the card title on error', async () => {
      ;(getLatestMoodStory as jest.Mock).mockResolvedValue({ error: 'Internal Server Error', status: 500 })

      render(await MoodStoryCard())

      expect(screen.getByRole('heading', { name: 'title' })).toBeInTheDocument()
    })
  })

  describe('when API returns an empty screens array', () => {
    it('renders StoryNotReady inside a Card', async () => {
      ;(getLatestMoodStory as jest.Mock).mockResolvedValue({ data: { screens: [] } })

      render(await MoodStoryCard())

      expect(screen.getByTestId('story-not-ready')).toBeInTheDocument()
      expect(screen.queryByTestId('mood-story-navigator')).not.toBeInTheDocument()
    })

    it('renders the card title', async () => {
      ;(getLatestMoodStory as jest.Mock).mockResolvedValue({ data: { screens: [] } })

      render(await MoodStoryCard())

      expect(screen.getByRole('heading', { name: 'title' })).toBeInTheDocument()
    })
  })

  describe('when API returns screens', () => {
    it('renders MoodStoryNavigator with the screens', async () => {
      ;(getLatestMoodStory as jest.Mock).mockResolvedValue({ data: { screens: mockScreens } })

      render(await MoodStoryCard())

      expect(screen.getByTestId('mood-story-navigator')).toBeInTheDocument()
      expect(screen.getByTestId('mood-story-navigator')).toHaveTextContent('2 screens')
    })

    it('does not render StoryNotReady or StoryError', async () => {
      ;(getLatestMoodStory as jest.Mock).mockResolvedValue({ data: { screens: mockScreens } })

      render(await MoodStoryCard())

      expect(screen.queryByTestId('story-not-ready')).not.toBeInTheDocument()
      expect(screen.queryByTestId('story-error')).not.toBeInTheDocument()
    })

    it('does not render a Card wrapper (navigator renders its own card)', async () => {
      ;(getLatestMoodStory as jest.Mock).mockResolvedValue({ data: { screens: mockScreens } })

      render(await MoodStoryCard())

      expect(screen.queryByRole('heading', { name: 'title' })).not.toBeInTheDocument()
    })
  })

  it('calls getLatestMoodStory with the authenticated session', async () => {
    ;(getLatestMoodStory as jest.Mock).mockResolvedValue({ data: { screens: mockScreens } })

    render(await MoodStoryCard())

    expect(getLatestMoodStory).toHaveBeenCalledWith(mockSession)
  })

  it('calls getLatestMoodStory with null when there is no session', async () => {
    ;(auth as jest.Mock).mockResolvedValue(null)
    ;(getLatestMoodStory as jest.Mock).mockResolvedValue({ error: 'Unauthorized', status: 401 })

    render(await MoodStoryCard())

    expect(getLatestMoodStory).toHaveBeenCalledWith(null)
  })
})

describe('resolveActionRoute', () => {
  it.each<[string, string, string]>([
    // Ukrainian
    ['UK – breathing', 'Дихальні вправи', '/guide'],
    ['UK – meditation', 'Медитація зараз', '/guide/meditations'],
    ['UK – exercises', 'Виконай вправи', '/guide'],
    ['UK – stress', 'Стрес і тривога', '/mood-tracker'],
    ['UK – mood', 'Відстежуй свій настрій', '/mood-tracker'],
    ['UK – sleep', 'Кращий сон щоночі', '/guide'],
    // English
    ['EN – breathing', 'Breathing exercise for calm', '/guide'],
    ['EN – meditation', 'Meditation for better sleep', '/guide/meditations'],
    ['EN – exercise', 'Try an exercise routine', '/guide'],
    ['EN – stress', 'Managing stress levels', '/mood-tracker'],
    ['EN – mood', 'Improve your mood today', '/mood-tracker'],
    ['EN – sleep', 'Better sleep and rest', '/guide'],
    // Polish
    ['PL – breathing', 'Technika oddechowa', '/guide'],
    ['PL – meditation', 'Medytacja przed snem', '/guide/meditations'],
    ['PL – exercise', 'Ćwiczenia relaksacyjne', '/guide'],
    ['PL – stress', 'Radzenie ze stresem', '/mood-tracker'],
    ['PL – mood', 'Nastrój dzisiaj', '/mood-tracker'],
    ['PL – sleep', 'Techniki snu i relaksu', '/guide'],
  ])('maps action correctly: %s', (_label, action, expected) => {
    expect(resolveActionRoute(action)).toBe(expected)
  })

  it('returns null for an unknown action', () => {
    expect(resolveActionRoute('__unknown_action_xyz__')).toBeNull()
  })
})
