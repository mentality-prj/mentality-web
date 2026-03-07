import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useLocale } from 'next-intl'

import { TIMER_INTERVAL_MS } from '@/constants/attentionSprint'
import {
  calculateRemainingTime,
  calculateStandardDeviation,
  generateSymbolGrid,
  getDifficultyConfig,
  getNextTarget,
  getRandomElement,
  isCorrectSymbol,
  shouldEndGame,
} from '@/helpers/attentionSprint.helpers'
import { logger } from '@/lib/logger'
import { saveAttentionSprintResult } from '@/requests/attentionSprint'

export function useAttentionSprintGame(
  symbols: string[],
  gridSize: number,
  gameDuration: number,
  propTarget?: string,
  propSymbols?: string[]
) {
  const { data: session } = useSession()
  const locale = useLocale()
  const lastGridTimeRef = useRef<number | null>(null)
  const timerIdRef = useRef<NodeJS.Timeout | null>(null)
  const resultSavedRef = useRef(false)

  const [difficulty, setDifficulty] = useState<number | null>(null)
  const [currentSymbols, setCurrentSymbols] = useState<string[]>(symbols)
  const [shouldChangeTarget, setShouldChangeTarget] = useState(false)
  const [currentTarget, setCurrentTarget] = useState<string>(propTarget ?? getRandomElement(symbols))

  const [gameStarted, setGameStarted] = useState(false)
  const [grid, setGrid] = useState<string[][]>([])
  const [timeLeft, setTimeLeft] = useState(gameDuration)
  const [score, setScore] = useState(0)
  const [errors, setErrors] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [clickSequence, setClickSequence] = useState<string[]>([])
  const [reactionTimes, setReactionTimes] = useState<number[]>([])

  const generateGrid = () => {
    lastGridTimeRef.current = Date.now()

    // Determine the active target first so the generated grid always contains the displayed target.
    const nextTarget = getNextTarget(shouldChangeTarget, Boolean(propTarget), currentSymbols)
    const targetForGrid = nextTarget ?? currentTarget

    if (nextTarget) {
      setCurrentTarget(nextTarget)
    }

    const newGrid = generateSymbolGrid(gridSize, currentSymbols, targetForGrid)
    setGrid(newGrid)
  }

  const startTimer = () => {
    lastGridTimeRef.current = Date.now()
    setTimeLeft(gameDuration)
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (shouldEndGame(prev)) {
          clearInterval(timer)
          setGameOver(true)
          return 0
        }
        return calculateRemainingTime(prev)
      })
    }, TIMER_INTERVAL_MS)
    timerIdRef.current = timer
  }

  const selectDifficulty = (level: number) => {
    // If symbols or target are provided via props, use them instead of difficulty config
    if (propSymbols || propTarget) {
      setDifficulty(level)
      setCurrentSymbols(symbols)
      setShouldChangeTarget(!propTarget)
      setCurrentTarget(propTarget ?? getRandomElement(symbols))
      return
    }

    const config = getDifficultyConfig(level)
    setDifficulty(level)
    setCurrentSymbols(config.symbols)
    setShouldChangeTarget(config.changeTarget)
    setCurrentTarget(getRandomElement(config.symbols))
  }

  const startGame = () => {
    if (difficulty === null) return
    setGameStarted(true)
    generateGrid()
    startTimer()
  }

  const handleClick = (symbol: string) => {
    if (gameOver) return

    // Calculate reaction time since grid was generated
    const reactionTime = lastGridTimeRef.current ? Date.now() - lastGridTimeRef.current : 0
    setReactionTimes((prev) => [...prev, reactionTime])
    setClickSequence((prev) => [...prev, symbol])

    if (isCorrectSymbol(symbol, currentTarget)) {
      setScore((prev) => prev + 1)
      generateGrid()
    } else {
      setErrors((prev) => prev + 1)
    }
  }

  const restart = () => {
    setScore(0)
    setErrors(0)
    setGameOver(false)
    setGameStarted(false)
    setDifficulty(null)
    setClickSequence([])
    setReactionTimes([])
    resultSavedRef.current = false
  }

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current)
      }
    }
  }, [])

  // Save results to backend when game over - only once per game
  useEffect(() => {
    if (gameOver && difficulty !== null && !resultSavedRef.current) {
      resultSavedRef.current = true

      // Calculate metrics from current state
      const totalAttempts = score + errors
      const accuracy = totalAttempts > 0 ? (score / totalAttempts) * 100 : 0
      const reactionTimeAvg =
        reactionTimes.length > 0 ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length : 0
      const reactionTimeStd = calculateStandardDeviation(reactionTimes)
      const durationMs = gameDuration * 1000

      saveAttentionSprintResult(session, {
        score,
        errors,
        difficulty,
        duration: durationMs,
        accuracy: Math.round(accuracy * 10) / 10, // Round to 1 decimal
        reactionTimeAvg: Math.round(reactionTimeAvg * 10) / 10,
        reactionTimeStd: Math.round(reactionTimeStd * 10) / 10,
        generatedSequence: clickSequence,
        language: locale,
      }).catch((error) => logger.error('failed to save result', error))
    }
  }, [gameOver, difficulty, gameDuration, session, locale, score, errors, reactionTimes, clickSequence])

  return {
    // State
    difficulty,
    currentSymbols,
    currentTarget,
    gameStarted,
    grid,
    timeLeft,
    score,
    errors,
    gameOver,
    // Actions
    selectDifficulty,
    startGame,
    handleClick,
    restart,
  }
}
