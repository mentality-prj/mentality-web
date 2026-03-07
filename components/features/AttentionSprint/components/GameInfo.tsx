import { useTranslations } from 'next-intl'

import { CSS_CLASSES } from '@/constants/attentionSprint'

interface GameInfoProps {
  currentTarget: string
  gameDuration: number
  currentSymbols: string[]
  timeLeft: number
  score: number
  errors: number
}

export function GameInfo({ currentTarget, gameDuration, currentSymbols, timeLeft, score, errors }: GameInfoProps) {
  const t = useTranslations('components.AttentionSprint')

  return (
    <>
      <p className={CSS_CLASSES.gameInfo}>
        {t('prompt', { symbol: currentTarget, duration: gameDuration })}
        <br />
        {t('included', { list: currentSymbols.join(', ') })}
      </p>
      <p className={CSS_CLASSES.gameStats}>
        {t('time', { time: timeLeft })} | {t('score', { score })} | {t('errors', { errors })}
      </p>
    </>
  )
}
