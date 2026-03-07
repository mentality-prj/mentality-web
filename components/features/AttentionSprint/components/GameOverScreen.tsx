import { useTranslations } from 'next-intl'

import { CSS_CLASSES } from '@/constants/attentionSprint'

interface GameOverScreenProps {
  score: number
  errors: number
  onRestart: () => void
}

export function GameOverScreen({ score, errors, onRestart }: GameOverScreenProps) {
  const t = useTranslations('components.AttentionSprint')

  return (
    <div className={CSS_CLASSES.gameOverContainer}>
      <h3 className={CSS_CLASSES.gameOverTitle}>{t('gameOver')}</h3>
      <p>{t('result', { score, errors })}</p>
      <button className={CSS_CLASSES.playAgainButton} onClick={onRestart}>
        {t('playAgain')}
      </button>
    </div>
  )
}
