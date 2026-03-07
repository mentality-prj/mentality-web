'use client'

import { useTranslations } from 'next-intl'

import {
  CSS_CLASSES,
  defaultGameDuration,
  defaultGridSize,
  defaultSymbols,
  TAB_VALUES,
} from '@/constants/attentionSprint'
import { useAttentionSprintGame } from '@/hooks/useAttentionSprintGame'
import { AttentionSprintProps } from '@/types/attentionSprint'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs'

import { DifficultySelector } from './components/DifficultySelector'
import { GameGrid } from './components/GameGrid'
import { GameInfo } from './components/GameInfo'
import { GameOverScreen } from './components/GameOverScreen'
import { StartGameButton } from './components/StartGameButton'

export const AttentionSprint = ({
  symbols: propSymbols,
  targetSymbol: propTarget,
  gridSize: propGridSize,
  gameDuration: propDuration,
}: AttentionSprintProps = {}) => {
  const symbols = propSymbols ?? defaultSymbols
  const gridSize = propGridSize ?? defaultGridSize
  const gameDuration = propDuration ?? defaultGameDuration

  const t = useTranslations('components.AttentionSprint')

  const {
    difficulty,
    currentSymbols,
    currentTarget,
    gameStarted,
    grid,
    timeLeft,
    score,
    errors,
    gameOver,
    selectDifficulty,
    startGame,
    handleClick,
    restart,
  } = useAttentionSprintGame(symbols, gridSize, gameDuration, propTarget, propSymbols)

  return (
    <div className={CSS_CLASSES.container}>
      <Tabs defaultValue={TAB_VALUES.GAME} className="w-full">
        <TabsList className={CSS_CLASSES.tabsList}>
          <TabsTrigger value={TAB_VALUES.GAME}>{t('tabGame')}</TabsTrigger>
          <TabsTrigger value={TAB_VALUES.STATS}>{t('tabStats')}</TabsTrigger>
        </TabsList>

        <TabsContent value={TAB_VALUES.GAME} className="text-center">
          {!gameStarted ? (
            <>
              <DifficultySelector selectedDifficulty={difficulty} onSelectDifficulty={selectDifficulty} />
              <StartGameButton onClick={startGame} disabled={difficulty === null} />
            </>
          ) : (
            <>
              <GameInfo
                currentTarget={currentTarget}
                gameDuration={gameDuration}
                currentSymbols={currentSymbols}
                timeLeft={timeLeft}
                score={score}
                errors={errors}
              />

              <GameGrid grid={grid} gridSize={gridSize} onCellClick={handleClick} disabled={gameOver} />

              {gameOver && <GameOverScreen score={score} errors={errors} onRestart={restart} />}
            </>
          )}
        </TabsContent>

        <TabsContent value={TAB_VALUES.STATS} className="text-center">
          <div className={CSS_CLASSES.statsEmpty}>
            <p>{t('statsEmpty')}</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
