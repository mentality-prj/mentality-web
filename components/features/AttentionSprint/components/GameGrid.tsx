import { CSS_CLASSES, GRID_CELL_SIZE } from '@/constants/attentionSprint'

interface GameGridProps {
  grid: string[][]
  gridSize: number
  onCellClick: (symbol: string) => void
  disabled: boolean
}

export function GameGrid({ grid, gridSize, onCellClick, disabled }: GameGridProps) {
  return (
    <div
      className={CSS_CLASSES.gridContainer}
      style={{ gridTemplateColumns: `repeat(${gridSize}, ${GRID_CELL_SIZE})` }}
    >
      {grid.flat().map((symbol, idx) => (
        <button
          key={idx}
          className={CSS_CLASSES.cellButton}
          onClick={() => onCellClick(symbol)}
          data-testid={`cell-${idx}`}
          disabled={disabled}
        >
          {symbol}
        </button>
      ))}
    </div>
  )
}
