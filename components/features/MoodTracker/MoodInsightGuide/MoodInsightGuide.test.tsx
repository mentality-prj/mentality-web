import { type ReactNode } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import { MoodInsightGuide } from './MoodInsightGuide'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('@/components/shared/Buttons/CloseIconButton', () => ({
  __esModule: true,
  default: ({ onClick }: { onClick: () => void }) => (
    <button type="button" onClick={onClick} data-testid="close-btn">
      close
    </button>
  ),
}))

jest.mock('@/components/shared/Cards/Card', () => ({
  __esModule: true,
  default: ({ children, tools }: { children: ReactNode; tools?: ReactNode }) => (
    <div data-testid="card">
      {tools}
      {children}
    </div>
  ),
}))

jest.mock('@/components/shared/FullScreenContainers/FullScreenBackdrop/FullScreenBackdrop', () => ({
  __esModule: true,
  default: ({ onClick }: { onClick: () => void }) => <button type="button" data-testid="backdrop" onClick={onClick} />,
}))

const GUIDE_SEEN_KEY = 'mood-guide-seen'

describe('MoodInsightGuide', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  it('renders the open-guide button', () => {
    render(<MoodInsightGuide />)
    expect(screen.getByRole('button', { name: 'openLabel' })).toBeInTheDocument()
  })

  describe('auto-open behaviour', () => {
    it('opens automatically when guide has not been seen', () => {
      render(<MoodInsightGuide />)
      expect(screen.getByTestId('card')).toBeInTheDocument()
    })

    it('does not open automatically when guide has already been seen', () => {
      localStorage.setItem(GUIDE_SEEN_KEY, '1')
      render(<MoodInsightGuide />)
      expect(screen.queryByTestId('card')).not.toBeInTheDocument()
    })
  })

  describe('open / close', () => {
    it('opens the guide when the info button is clicked', () => {
      localStorage.setItem(GUIDE_SEEN_KEY, '1')
      render(<MoodInsightGuide />)
      fireEvent.click(screen.getByRole('button', { name: 'openLabel' }))
      expect(screen.getByTestId('card')).toBeInTheDocument()
    })

    it('closes the guide when CloseIconButton is clicked and persists the seen key', () => {
      render(<MoodInsightGuide />)
      fireEvent.click(screen.getByTestId('close-btn'))
      expect(screen.queryByTestId('card')).not.toBeInTheDocument()
      expect(localStorage.getItem(GUIDE_SEEN_KEY)).toBe('1')
    })

    it('closes the guide when the backdrop is clicked', () => {
      render(<MoodInsightGuide />)
      fireEvent.click(screen.getByTestId('backdrop'))
      expect(screen.queryByTestId('card')).not.toBeInTheDocument()
    })
  })

  describe('step navigation', () => {
    it('shows step 1 content on open', () => {
      render(<MoodInsightGuide />)
      expect(screen.getByText('step1.title')).toBeInTheDocument()
      expect(screen.getByText('step1.description')).toBeInTheDocument()
    })

    it('does not show Back button on first step', () => {
      render(<MoodInsightGuide />)
      expect(screen.queryByText('prev')).not.toBeInTheDocument()
    })

    it('advances to next step when Next is clicked', () => {
      render(<MoodInsightGuide />)
      fireEvent.click(screen.getByText('next'))
      expect(screen.getByText('step2.title')).toBeInTheDocument()
    })

    it('shows Back button after advancing past first step', () => {
      render(<MoodInsightGuide />)
      fireEvent.click(screen.getByText('next'))
      expect(screen.getByText('prev')).toBeInTheDocument()
    })

    it('goes back to previous step when Back is clicked', () => {
      render(<MoodInsightGuide />)
      fireEvent.click(screen.getByText('next'))
      fireEvent.click(screen.getByText('prev'))
      expect(screen.getByText('step1.title')).toBeInTheDocument()
    })

    it('shows Done button on last step', () => {
      render(<MoodInsightGuide />)
      fireEvent.click(screen.getByText('next'))
      fireEvent.click(screen.getByText('next'))
      fireEvent.click(screen.getByText('next'))
      expect(screen.getByText('done')).toBeInTheDocument()
    })

    it('closes the guide when Done is clicked on last step', () => {
      render(<MoodInsightGuide />)
      fireEvent.click(screen.getByText('next'))
      fireEvent.click(screen.getByText('next'))
      fireEvent.click(screen.getByText('next'))
      fireEvent.click(screen.getByText('done'))
      expect(screen.queryByTestId('card')).not.toBeInTheDocument()
    })

    it('navigates directly to a step via pagination dot', () => {
      render(<MoodInsightGuide />)
      fireEvent.click(screen.getByRole('button', { name: 'stepLabel 3' }))
      expect(screen.getByText('step3.title')).toBeInTheDocument()
    })
  })
})
