import { SquarePen } from 'lucide-react'

interface EditTipsButtonProps {
  onEdit?: () => void
  className?: string
}

export default function EditTipButton({ onEdit, className = '' }: EditTipsButtonProps) {
  return (
    <button
      type="button"
      aria-label="Редагувати"
      onClick={onEdit}
      title="Редагувати"
      className={`tool-icon ${className}`}
    >
      <SquarePen size={12} />
    </button>
  )
}
