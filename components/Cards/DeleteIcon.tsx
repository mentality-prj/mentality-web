'use client'
import { Trash } from 'lucide-react'

interface EditIconProps {
  onClick: () => void
}

const EditIcon = ({ onClick }: EditIconProps) => {
  return (
    <button onClick={onClick}>
      <Trash size={12} />
    </button>
  )
}

export default EditIcon
