'use client'
import { Edit2 } from 'lucide-react'

interface EditIconProps {
  onClick: () => void
}

const EditIcon = ({ onClick }: EditIconProps) => {
  return (
    <button onClick={onClick}>
      <Edit2 size={12} />
    </button>
  )
}

export default EditIcon
