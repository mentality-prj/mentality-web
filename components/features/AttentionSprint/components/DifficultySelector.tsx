import { useTranslations } from 'next-intl'

import { CSS_CLASSES } from '@/constants/attentionSprint'
import { DifficultyLevelKey } from '@/types/attentionSprint'

type DifficultyItem = DifficultyLevelKey

const difficultyLevels: DifficultyItem[] = [
  { level: 0, key: 'level0' },
  { level: 1, key: 'level1' },
  { level: 2, key: 'level2' },
  { level: 3, key: 'level3' },
]

interface DifficultyButtonProps {
  level: number
  isSelected: boolean
  onClick: () => void
  label: string
}

function DifficultyButton({ level, isSelected, onClick, label }: DifficultyButtonProps) {
  const className = `${CSS_CLASSES.difficultyButtonBase} ${
    isSelected ? CSS_CLASSES.difficultyButtonActive : CSS_CLASSES.difficultyButtonInactive
  }`

  return (
    <button className={className} onClick={onClick} data-testid={`difficulty-${level}`}>
      {label}
    </button>
  )
}

interface DifficultySelectorProps {
  selectedDifficulty: number | null
  onSelectDifficulty: (level: number) => void
}

export function DifficultySelector({ selectedDifficulty, onSelectDifficulty }: DifficultySelectorProps) {
  const t = useTranslations('components.AttentionSprint')

  return (
    <div className={CSS_CLASSES.difficultyContainer}>
      <p className={CSS_CLASSES.difficultyLabel}>{t('difficulty')}</p>
      <div className={CSS_CLASSES.difficultyButtonsContainer}>
        {difficultyLevels.map(({ level, key }) => (
          <DifficultyButton
            key={level}
            level={level}
            isSelected={selectedDifficulty === level}
            onClick={() => onSelectDifficulty(level)}
            label={t(key)}
          />
        ))}
      </div>
    </div>
  )
}
