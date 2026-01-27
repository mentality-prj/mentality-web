import { ReactNode } from 'react'
import { X } from 'lucide-react'

import { Statuses, StatusType } from '../../types/status.types'

interface TagProps {
  children?: ReactNode
  text: string
  type?: StatusType
  onRemove?: (text: string) => void
  onClick?: () => void
  className?: string
}

const Tag = ({ children, text, type = 'tag', onRemove, onClick, className = '' }: TagProps) => {
  const base = `whitespace-nowrap rounded px-3 py-1 text-xs ${Statuses[type as StatusType]}`

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${base} ${className}`}>
        {text || children}
      </button>
    )
  }

  return (
    <span className={`inline-flex items-center gap-1 ${base} ${className}`}>
      <span>{text || children}</span>
      {onRemove && (
        <button
          type="button"
          aria-label={`remove-${text}`}
          title="Remove"
          onClick={() => onRemove(text)}
          className="icon-tool-text -mr-1 p-0"
        >
          <X size={12} />
        </button>
      )}
    </span>
  )
}

export default Tag
