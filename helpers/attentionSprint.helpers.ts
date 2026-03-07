import { DEFAULT_DIFFICULTY_CONFIG, DIFFICULTY_CONFIGS } from '@/constants/attentionSprint'
import { DifficultyConfig } from '@/types/attentionSprint'

/**
 * Get difficulty configuration by level
 */
export function getDifficultyConfig(level: number): DifficultyConfig {
  const config = DIFFICULTY_CONFIGS[level as keyof typeof DIFFICULTY_CONFIGS]
  if (config) {
    return config
  }
  return DEFAULT_DIFFICULTY_CONFIG
}

/**
 * Get random element from array
 */
export function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Generate a random grid of symbols with guaranteed target presence
 */
export function generateSymbolGrid(gridSize: number, availableSymbols: string[], currentTarget: string): string[][] {
  const newGrid: string[][] = []
  let hasTarget = false

  // Fill grid with random symbols
  for (let i = 0; i < gridSize; i++) {
    const row: string[] = []
    for (let j = 0; j < gridSize; j++) {
      const randomSymbol = getRandomElement(availableSymbols)
      if (randomSymbol === currentTarget) {
        hasTarget = true
      }
      row.push(randomSymbol)
    }
    newGrid.push(row)
  }

  // Ensure at least one target symbol exists
  if (!hasTarget) {
    const randI = Math.floor(Math.random() * gridSize)
    const randJ = Math.floor(Math.random() * gridSize)
    newGrid[randI][randJ] = currentTarget
  }

  return newGrid
}

/**
 * Get next target symbol if target should change
 */
export function getNextTarget(
  shouldChangeTarget: boolean,
  hasPropTarget: boolean,
  availableSymbols: string[]
): string | null {
  if (shouldChangeTarget && !hasPropTarget) {
    return getRandomElement(availableSymbols)
  }
  return null
}

/**
 * Check if clicked symbol matches target
 */
export function isCorrectSymbol(clickedSymbol: string, targetSymbol: string): boolean {
  return clickedSymbol === targetSymbol
}

/**
 * Calculate remaining time
 */
export function calculateRemainingTime(currentTime: number): number {
  if (currentTime <= 1) {
    return 0
  }
  return currentTime - 1
}

/**
 * Check if game should end
 */
export function shouldEndGame(timeLeft: number): boolean {
  return timeLeft <= 1
}

/**
 * Calculate standard deviation for an array of numbers
 */
export function calculateStandardDeviation(values: number[]): number {
  if (values.length === 0) return 0
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const squareDiffs = values.map((v) => Math.pow(v - mean, 2))
  const variance = squareDiffs.reduce((a, b) => a + b, 0) / values.length
  return Math.sqrt(variance)
}
