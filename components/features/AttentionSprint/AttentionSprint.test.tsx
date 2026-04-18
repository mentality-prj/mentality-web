/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable security/detect-object-injection */
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useLocale, useTranslations } from 'next-intl'

import { AttentionSprint } from '@/components/features/AttentionSprint'
import { useAuth } from '@/context/AuthProvider'
import { saveAttentionSprintResult } from '@/requests/attentionSprint'

// mock translations and use fake timers
jest.mock('next-intl')
jest.mock('@/context/AuthProvider', () => ({ useAuth: jest.fn() }))
jest.mock('@/requests/attentionSprint')

beforeEach(() => {
  jest.useFakeTimers()
  jest.clearAllMocks()

  // Mock session
  ;(useAuth as jest.Mock).mockReturnValue({
    session: { user: { id: 'test-user' } },
    status: 'authenticated',
  })

  // Mock locale
  ;(useLocale as jest.Mock).mockReturnValue('en')

  // Mock API function
  ;(saveAttentionSprintResult as jest.Mock).mockResolvedValue({
    data: {},
  })
  ;(useTranslations as jest.Mock).mockReturnValue((key: string, vars?: any) => {
    // simple Ukrainian mapping matching earlier strings
    const map: Record<string, string> = {
      title: 'Attention Sprint',
      difficulty: 'Рівень складності:',
      level0: '🟢 Простий',
      level1: '🟡 Середній',
      level2: '🟠 Складний',
      level3: '🔴 Просунутий',
      startGame: 'Почати гру',
      prompt: `Знайди всі \"${vars?.symbol || ''}\" за ${vars?.duration || ''} секунд!`,
      included: `(у масиві: ${vars?.list || ''})`,
      time: `Час: ${vars?.time || ''}s`,
      score: `✅ Правильні: ${vars?.score || ''}`,
      errors: `❌ Помилки: ${vars?.errors || ''}`,
      gameOver: 'Гра завершена!',
      result: `Твій результат: ${vars?.score || ''} правильних натискань, ${vars?.errors || ''} помилок.`,
      playAgain: 'Зіграти знову',
    }
    return map[key] || key
  })
})

afterEach(() => {
  jest.runOnlyPendingTimers()
  jest.useRealTimers()
  jest.restoreAllMocks()
})

// Helper function to start game with difficulty selection
const startGameWithDifficulty = (difficulty: number) => {
  act(() => {
    const difficultyButton = screen.getByTestId(`difficulty-${difficulty}`)
    fireEvent.click(difficultyButton)
  })
  act(() => {
    const startButton = screen.getByRole('button', { name: 'Почати гру' })
    fireEvent.click(startButton)
  })
}

describe('AttentionSprint component', () => {
  it('shows difficulty selection and start button', () => {
    render(<AttentionSprint targetSymbol="A" />)

    expect(screen.getByText('Рівень складності:')).toBeInTheDocument()
    expect(screen.getByText('🟢 Простий')).toBeInTheDocument()
    expect(screen.getByText('🟡 Середній')).toBeInTheDocument()
    expect(screen.getByText('🟠 Складний')).toBeInTheDocument()
    expect(screen.getByText('🔴 Просунутий')).toBeInTheDocument()

    const startButton = screen.getByRole('button', { name: 'Почати гру' })
    expect(startButton).toBeInTheDocument()
    expect(startButton).toBeDisabled()

    // game elements should not be visible yet
    expect(screen.queryByText(/Знайди всі/)).not.toBeInTheDocument()
  })

  it('enables start button after difficulty selection', () => {
    render(<AttentionSprint targetSymbol="A" />)

    const startButton = screen.getByRole('button', { name: 'Почати гру' })
    expect(startButton).toBeDisabled()

    // select difficulty
    fireEvent.click(screen.getByTestId('difficulty-1'))
    expect(startButton).not.toBeDisabled()
  })

  it('starts game after difficulty selection and button click', () => {
    render(<AttentionSprint targetSymbol="A" />)

    startGameWithDifficulty(1)

    // now game should be visible
    expect(screen.getByText(/Знайди всі/)).toBeInTheDocument()
    expect(screen.getByText(/Час: 30s/)).toBeInTheDocument()
  })

  it('renders game and counts down', () => {
    render(<AttentionSprint targetSymbol="A" />)

    // start the game
    startGameWithDifficulty(1)

    expect(screen.getByText(/Знайди всі/)).toBeInTheDocument()
    expect(screen.getByText(/Час: 30s/)).toBeInTheDocument()

    // advance time by 5 seconds
    act(() => {
      jest.advanceTimersByTime(5000)
    })
    expect(screen.getByText(/Час: 25s/)).toBeInTheDocument()
  })

  it('increments score when clicking correct symbol', () => {
    // force Math.random to always return zero so grid is full of targetSymbol
    jest.spyOn(Math, 'random').mockReturnValue(0)
    render(<AttentionSprint targetSymbol="A" />)

    // start the game
    startGameWithDifficulty(1)

    const buttons = screen.getAllByTestId(/cell-/)
    expect(buttons.length).toBeGreaterThan(0)

    fireEvent.click(buttons[0])
    expect(screen.getByText(/Правильні: 1/)).toBeInTheDocument()
  })

  it('works with emoji symbols and numeric target', () => {
    // custom props: emoji list, target '😊'
    jest.spyOn(Math, 'random').mockReturnValue(0)
    render(<AttentionSprint symbols={['😊', '🎯', '1']} targetSymbol="😊" gridSize={3} gameDuration={5} />)

    // start the game
    startGameWithDifficulty(1)

    // all cells should be the target due to RNG
    const buttons = screen.getAllByTestId(/cell-/)
    buttons.forEach((b) => expect(b.textContent).toBe('😊'))

    fireEvent.click(buttons[0])
    expect(screen.getByText(/Правильні: 1/)).toBeInTheDocument()
  })

  it('increments errors when clicking wrong symbol', () => {
    // use a fixed target and ensure RNG returns other symbol
    jest.spyOn(Math, 'random').mockReturnValue(0.9)
    render(<AttentionSprint targetSymbol="A" symbols={['A', 'B']} />)

    // start the game
    startGameWithDifficulty(1)

    const buttons = screen.getAllByTestId(/cell-/)
    expect(buttons.length).toBeGreaterThan(0)

    fireEvent.click(buttons[0])
    expect(screen.getByText(/Помилки: 1/)).toBeInTheDocument()
  })

  it('always generates at least one target symbol', () => {
    // even if RNG would avoid the target, the component should inject one
    jest.spyOn(Math, 'random').mockReturnValue(0.9)
    render(<AttentionSprint targetSymbol="A" />)

    // start the game
    startGameWithDifficulty(1)

    const cells = screen.getAllByTestId(/cell-/)
    const texts = cells.map((b) => b.textContent)
    expect(texts).toContain('A')
  })

  it('shows game over message when timer expires', () => {
    render(<AttentionSprint />)

    // start the game
    startGameWithDifficulty(1)

    act(() => {
      jest.advanceTimersByTime(30000)
    })
    expect(screen.getByText(/Гра завершена/)).toBeInTheDocument()
  })

  it('restart button returns to difficulty selection', () => {
    render(<AttentionSprint targetSymbol="A" />)

    // start the game
    startGameWithDifficulty(1)

    act(() => {
      jest.advanceTimersByTime(30000)
    })
    const playAgain = screen.getByRole('button', { name: 'Зіграти знову' })
    expect(playAgain).toBeInTheDocument()

    // after restart, should return to difficulty selection
    fireEvent.click(playAgain)
    expect(screen.queryByText(/Гра завершена/)).toBeNull()
    expect(screen.getByText('Рівень складності:')).toBeInTheDocument()
  })

  it('disables the grid once game is over', () => {
    render(<AttentionSprint targetSymbol="A" />)

    // start the game
    startGameWithDifficulty(1)

    act(() => {
      jest.advanceTimersByTime(30000)
    })
    // only grid cells should be disabled, not the restart button
    const cells = screen.getAllByTestId(/cell-/)
    cells.forEach((b) => expect(b).toBeDisabled())
  })

  it('level 0 uses digits and fixed target', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0)
    render(<AttentionSprint />)

    startGameWithDifficulty(0)

    const cells = screen.getAllByTestId(/cell-/)
    const texts = cells.map((b) => b.textContent)
    // should contain digits
    expect(texts.some((t) => /[0-9]/.test(t || ''))).toBe(true)
  })

  it('level 3 uses special symbols', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0)
    render(<AttentionSprint />)

    startGameWithDifficulty(3)

    const cells = screen.getAllByTestId(/cell-/)
    const texts = cells.map((b) => b.textContent)
    // should contain special symbols like ★, ●, etc.
    expect(texts.some((t) => /[★●■▲♦♥♣♠☺☻]/.test(t || ''))).toBe(true)
  })

  it('sends game results to backend on finish', async () => {
    render(<AttentionSprint />)

    startGameWithDifficulty(1)

    // advance time to finish the game
    await act(async () => {
      jest.advanceTimersByTime(30000)
    })

    await waitFor(() => {
      expect(saveAttentionSprintResult).toHaveBeenCalledWith(
        { user: { id: 'test-user' } },
        expect.objectContaining({
          score: expect.any(Number),
          errors: expect.any(Number),
          difficulty: 1,
          duration: 30000, // milliseconds
          accuracy: expect.any(Number),
          reactionTimeAvg: expect.any(Number),
          reactionTimeStd: expect.any(Number),
          generatedSequence: expect.any(Array),
          language: 'en',
        })
      )
    })
  })
})
