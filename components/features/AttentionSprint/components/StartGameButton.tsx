import { useTranslations } from 'next-intl'

import { CSS_CLASSES } from '@/constants/attentionSprint'
import { Button } from '@/ui/button'

interface StartGameButtonProps {
  onClick: () => void
  disabled: boolean
}

export function StartGameButton({ onClick, disabled }: StartGameButtonProps) {
  const t = useTranslations('components.AttentionSprint')

  const className = `${CSS_CLASSES.startButtonBase} ${
    !disabled ? CSS_CLASSES.startButtonEnabled : CSS_CLASSES.startButtonDisabled
  }`

  return (
    <Button className={className} onClick={onClick} disabled={disabled} data-testid="start-game-button">
      {t('startGame')}
    </Button>
  )
}
