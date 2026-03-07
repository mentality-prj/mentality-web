import { DifficultyConfig } from '@/types/attentionSprint'

// Timer constants
export const TIMER_INTERVAL_MS = 1000

// Grid constants
export const GRID_CELL_SIZE = '3rem'

// Difficulty configurations
export const DIFFICULTY_CONFIGS: Record<number, DifficultyConfig> = {
  0: {
    // Digits, fixed target
    symbols: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    changeTarget: false,
  },
  1: {
    // Letters, fixed target
    symbols: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
    changeTarget: false,
  },
  2: {
    // Letters, changing target
    symbols: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
    changeTarget: true,
  },
  3: {
    // Special symbols, changing target
    symbols: ['★', '●', '■', '▲', '♦', '♥', '♣', '♠', '☺', '☻'],
    changeTarget: true,
  },
}

export const DEFAULT_DIFFICULTY_CONFIG: DifficultyConfig = DIFFICULTY_CONFIGS[2]

// Default data for component props fallback
export const letterSymbols = ['A', 'B', 'C', 'D', 'E']

export const defaultSymbols = letterSymbols
export const defaultGridSize = 5
export const defaultGameDuration = 30

// Tab values
export const TAB_VALUES = {
  GAME: 'game',
  STATS: 'stats',
} as const

// CSS classes
export const CSS_CLASSES = {
  container: 'mx-auto max-w-lg p-4',
  title: 'mb-4 text-center text-2xl font-semibold',
  tabsList: 'mb-6 grid w-full grid-cols-2',
  difficultyContainer: 'mt-8',
  difficultyLabel: 'mb-4 text-lg font-medium',
  difficultyButtonsContainer: 'mb-6 flex flex-wrap justify-center gap-3',
  difficultyButtonBase: 'rounded px-4 py-2 text-sm transition-colors',
  difficultyButtonActive: 'bg-primary text-white',
  difficultyButtonInactive: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
  startButtonBase: 'rounded px-6 py-3 text-lg text-white',
  startButtonEnabled: 'bg-primary hover:bg-primary/90',
  startButtonDisabled: 'cursor-not-allowed bg-gray-300',
  gameInfo: 'mt-2',
  gameStats: 'mt-1',
  gridContainer: 'mt-6 grid justify-center gap-2',
  cellButton: 'rounded border p-2 text-xl',
  gameOverContainer: 'mt-6',
  gameOverTitle: 'text-xl font-medium',
  playAgainButton: 'mt-4 rounded bg-primary px-4 py-2 text-white',
  statsEmpty: 'mt-8 text-textcolor-secondary',
} as const
