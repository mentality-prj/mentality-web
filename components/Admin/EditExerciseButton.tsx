import { SquarePen } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/ui/button'

interface EditExerciseButtonProps {
  className?: string
  onEdit: () => void
}

const EditExerciseButton = ({ className, onEdit }: EditExerciseButtonProps) => {
  const t = useTranslations('common.Buttons')

  return (
    <Button variant="iconTool" aria-label={t('edit')} title={t('edit')} onClick={onEdit} className={className}>
      <SquarePen size={12} />
    </Button>
  )
}

export default EditExerciseButton
