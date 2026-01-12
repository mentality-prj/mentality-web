import { SquarePen } from 'lucide-react'

interface EditExerciseButtonProps {
  className?: string
  onEdit: () => void
}

const EditExerciseButton = ({ className, onEdit }: EditExerciseButtonProps) => {
  return (
    <button
      type="button"
      aria-label="Редагувати"
      title="Редагувати"
      onClick={onEdit}
      className={`tool-icon ${className}`}
    >
      <SquarePen size={12} />
    </button>
  )
}

export default EditExerciseButton
