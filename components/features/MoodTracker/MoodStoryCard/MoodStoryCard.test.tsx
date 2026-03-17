import { fireEvent, render, screen, within } from '@testing-library/react'
import { useTranslations } from 'next-intl'

import { MoodStoryCard } from '@/components/features/MoodTracker/MoodStoryCard/MoodStoryCard'
import { useMoodStory } from '@/hooks/useMoodStory'

jest.mock('next-intl')
jest.mock('@/hooks/useMoodStory')
jest.mock('@/lib/logger', () => ({
  logger: { warn: jest.fn(), error: jest.fn(), info: jest.fn() },
}))
jest.mock('@/components/shared/Loading', () => ({
  __esModule: true,
  default: () => <div data-testid="loading-spinner" />,
}))
jest.mock('@/components/shared/FullScreenContainers/FullScreenBackdrop/FullScreenBackdrop', () => ({
  __esModule: true,
  default: ({ onClick }: { onClick?: () => void }) => (
    <div
      data-testid="backdrop"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    />
  ),
}))
jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}))

const mockRetry = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
  ;(useTranslations as jest.Mock).mockReturnValue((key: string, vars?: Record<string, unknown>) => {
    if (vars) {
      return Object.entries(vars).reduce((str, [k, v]) => str.replace(`{${k}}`, String(v)), key)
    }
    return key
  })
})

function renderCard() {
  return render(<MoodStoryCard />)
}

function openStory() {
  fireEvent.click(screen.getByRole('button', { name: 'viewCta' }))
}

describe('MoodStoryCard – entry card', () => {
  it('renders entry card title and CTA', () => {
    ;(useMoodStory as jest.Mock).mockReturnValue({ state: { status: 'idle' }, retry: mockRetry })

    renderCard()

    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('description')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'viewCta' })).toBeInTheDocument()
  })

  it('shows loading spinner while loading', () => {
    ;(useMoodStory as jest.Mock).mockReturnValue({ state: { status: 'loading' }, retry: mockRetry })

    renderCard()

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('shows loading spinner while polling', () => {
    ;(useMoodStory as jest.Mock).mockReturnValue({
      state: { status: 'polling' },
      retry: mockRetry,
    })

    renderCard()

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })
})

describe('MoodStoryCard – overlay', () => {
  it('opens overlay on CTA click', () => {
    ;(useMoodStory as jest.Mock).mockReturnValue({ state: { status: 'idle' }, retry: mockRetry })

    renderCard()
    openStory()

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('renders loading skeleton inside overlay when loading', () => {
    ;(useMoodStory as jest.Mock).mockReturnValue({ state: { status: 'loading' }, retry: mockRetry })

    renderCard()
    openStory()

    expect(screen.getByText('text')).toBeInTheDocument()
  })

  it('renders not-ready state inside overlay', () => {
    ;(useMoodStory as jest.Mock).mockReturnValue({
      state: { status: 'not-ready' },
      retry: mockRetry,
    })

    renderCard()
    openStory()

    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText('title')).toBeInTheDocument()
    expect(within(dialog).getByText('description')).toBeInTheDocument()
  })

  it('renders error state with retry button inside overlay', () => {
    ;(useMoodStory as jest.Mock).mockReturnValue({ state: { status: 'error' }, retry: mockRetry })

    renderCard()
    openStory()

    expect(screen.getByText('retryCta')).toBeInTheDocument()
  })

  it('calls retry when retry button is clicked', () => {
    ;(useMoodStory as jest.Mock).mockReturnValue({ state: { status: 'error' }, retry: mockRetry })

    renderCard()
    openStory() // also calls retry() due to error state — reset count before asserting the button
    mockRetry.mockClear()
    fireEvent.click(screen.getByText('retryCta'))

    expect(mockRetry).toHaveBeenCalledTimes(1)
  })

  it('renders story screens in success state', () => {
    ;(useMoodStory as jest.Mock).mockReturnValue({
      state: {
        status: 'success',
        story: { screens: [{ title: 'Screen One', text: 'Body text' }] },
      },
      retry: mockRetry,
    })

    renderCard()
    openStory()

    expect(screen.getByText('Screen One')).toBeInTheDocument()
    expect(screen.getByText('Body text')).toBeInTheDocument()
  })

  it('renders progress dots and navigation in success state with multiple screens', () => {
    ;(useMoodStory as jest.Mock).mockReturnValue({
      state: {
        status: 'success',
        story: {
          screens: [
            { title: 'Screen One', text: 'Body one' },
            { title: 'Screen Two', text: 'Body two' },
          ],
        },
      },
      retry: mockRetry,
    })

    renderCard()
    openStory()

    expect(screen.getByRole('button', { name: 'prevAriaLabel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'nextAriaLabel' })).toBeInTheDocument()
    expect(screen.getByText('Screen One')).toBeInTheDocument()
  })

  it('navigates to next screen on next button click', () => {
    ;(useMoodStory as jest.Mock).mockReturnValue({
      state: {
        status: 'success',
        story: {
          screens: [
            { title: 'Screen One', text: 'Body one' },
            { title: 'Screen Two', text: 'Body two' },
          ],
        },
      },
      retry: mockRetry,
    })

    renderCard()
    openStory()
    fireEvent.click(screen.getByRole('button', { name: 'nextAriaLabel' }))

    expect(screen.getByText('Screen Two')).toBeInTheDocument()
  })

  it('navigates with ArrowRight/ArrowLeft keyboard events', () => {
    ;(useMoodStory as jest.Mock).mockReturnValue({
      state: {
        status: 'success',
        story: {
          screens: [
            { title: 'Screen One', text: 'Body one' },
            { title: 'Screen Two', text: 'Body two' },
          ],
        },
      },
      retry: mockRetry,
    })

    renderCard()
    openStory()
    fireEvent.keyDown(document, { key: 'ArrowRight' })

    expect(screen.getByText('Screen Two')).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'ArrowLeft' })

    expect(screen.getByText('Screen One')).toBeInTheDocument()
  })

  it('closes overlay when backdrop is clicked', () => {
    ;(useMoodStory as jest.Mock).mockReturnValue({
      state: { status: 'not-ready' },
      retry: mockRetry,
    })

    renderCard()
    openStory()
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('backdrop'))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes overlay when close button is clicked', () => {
    ;(useMoodStory as jest.Mock).mockReturnValue({
      state: { status: 'not-ready' },
      retry: mockRetry,
    })

    renderCard()
    openStory()
    fireEvent.click(screen.getByRole('button', { name: 'closeAriaLabel' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

describe('MoodStoryCard – action routes', () => {
  it('renders a link for a known action matching the expected route', () => {
    ;(useMoodStory as jest.Mock).mockReturnValue({
      state: {
        status: 'success',
        story: { screens: [{ title: 'T', text: 'B', action: 'Дихальні вправи' }] },
      },
      retry: mockRetry,
    })

    renderCard()
    openStory()

    const link = screen.getByRole('link', { name: 'Дихальні вправи' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/guide')
  })

  it('renders a link for медитац action pointing to meditations route', () => {
    ;(useMoodStory as jest.Mock).mockReturnValue({
      state: {
        status: 'success',
        story: { screens: [{ title: 'T', text: 'B', action: 'Медитація для сну' }] },
      },
      retry: mockRetry,
    })

    renderCard()
    openStory()

    const link = screen.getByRole('link', { name: 'Медитація для сну' })
    expect(link).toHaveAttribute('href', '/guide/meditations')
  })

  it('omits CTA link and does not throw for an unknown action', () => {
    ;(useMoodStory as jest.Mock).mockReturnValue({
      state: {
        status: 'success',
        story: { screens: [{ title: 'T', text: 'B', action: 'Невідома дія xyz' }] },
      },
      retry: mockRetry,
    })

    renderCard()
    openStory()

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.queryByText('Невідома дія xyz')).not.toBeInTheDocument()
  })
})
