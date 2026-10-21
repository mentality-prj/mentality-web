import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useTranslations } from 'next-intl'

import { ExerciseFeedbackPanel } from '@/components/features/Guide/ExerciseFeedbackPanel'
import { useAuth } from '@/context/AuthProvider'
import { clearExerciseFeedback, saveExerciseFeedback } from '@/requests/exerciseFeedback'

jest.mock('next-intl', () => ({ useTranslations: jest.fn() }))
jest.mock('@/context/AuthProvider', () => ({ useAuth: jest.fn() }))
jest.mock('@/requests/exerciseFeedback', () => ({ saveExerciseFeedback: jest.fn(), clearExerciseFeedback: jest.fn() }))

beforeEach(() => {
  jest.clearAllMocks()
  ;(useTranslations as jest.Mock).mockReturnValue((key: string) => key)
  ;(useAuth as jest.Mock).mockReturnValue({ session: { user: { id: 'current-owner' } } })
})

describe('ExerciseFeedbackPanel', () => {
  it('makes no save until the user explicitly votes', () => {
    render(<ExerciseFeedbackPanel category="breathing" initialHelpful={null} />)
    expect(screen.getByRole('button', { name: 'helpful' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'notHelpful' })).toHaveAttribute('aria-pressed', 'false')
    expect(saveExerciseFeedback).not.toHaveBeenCalled()
  })

  it('only marks the vote selected after server acknowledgment, and allows a later change', async () => {
    ;(saveExerciseFeedback as jest.Mock)
      .mockResolvedValueOnce({ data: { category: 'breathing', helpful: true } })
      .mockResolvedValueOnce({ data: { category: 'breathing', helpful: false } })
    render(<ExerciseFeedbackPanel category="breathing" initialHelpful={null} />)

    fireEvent.click(screen.getByRole('button', { name: 'helpful' }))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('saved'))
    expect(saveExerciseFeedback).toHaveBeenCalledWith(
      expect.objectContaining({ user: expect.objectContaining({ id: 'current-owner' }) }),
      'breathing',
      true
    )
    expect(screen.getByRole('button', { name: 'helpful' })).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(screen.getByRole('button', { name: 'notHelpful' }))
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'notHelpful' })).toHaveAttribute('aria-pressed', 'true')
    )
    expect(screen.getByRole('button', { name: 'helpful' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('does not present an unavailable feedback read as an unanswered activity', async () => {
    ;(saveExerciseFeedback as jest.Mock).mockResolvedValue({
      data: { category: 'breathing', helpful: true },
    })
    render(<ExerciseFeedbackPanel category="breathing" initialHelpful={null} loadFailed />)

    expect(screen.getByRole('alert')).toHaveTextContent('loadFailed')
    expect(screen.getByRole('button', { name: 'helpful' })).toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(screen.getByRole('button', { name: 'helpful' }))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('saved'))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'helpful' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('keeps the previously stored response if the backend fails', async () => {
    ;(saveExerciseFeedback as jest.Mock).mockResolvedValue({ error: 'Unavailable', status: 503 })
    render(<ExerciseFeedbackPanel category="focus" initialHelpful={true} />)

    fireEvent.click(screen.getByRole('button', { name: 'notHelpful' }))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('failed'))
    expect(screen.getByRole('button', { name: 'helpful' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'notHelpful' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('removes a previously saved rating and its future recommendation influence', async () => {
    ;(clearExerciseFeedback as jest.Mock).mockResolvedValue({
      data: { category: 'calming', cleared: true },
    })
    render(<ExerciseFeedbackPanel category="calming" initialHelpful={true} />)
    expect(screen.getByRole('button', { name: 'clear' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'clear' }))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('cleared'))
    expect(clearExerciseFeedback).toHaveBeenCalledWith(
      expect.objectContaining({ user: expect.objectContaining({ id: 'current-owner' }) }),
      'calming'
    )
    expect(screen.queryByRole('button', { name: 'clear' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'helpful' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'notHelpful' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('refuses a write if the verified client session has not hydrated', () => {
    ;(useAuth as jest.Mock).mockReturnValue({ session: null })
    render(<ExerciseFeedbackPanel category="meditation" initialHelpful={null} />)
    fireEvent.click(screen.getByRole('button', { name: 'helpful' }))
    expect(screen.getByRole('status')).toHaveTextContent('login')
    expect(saveExerciseFeedback).not.toHaveBeenCalled()
  })
})
