import { ReactNode } from 'react'

import { Statuses, StatusType } from '../../types/status.types'

interface TagProps {
  children?: ReactNode
  text: string
  type?: StatusType
}

const Tag = ({ children, text, type = 'tag' }: TagProps) => {
  return (
    <span key={text} className={`whitespace-nowrap rounded-default px-3 py-1 text-xs ${Statuses[type as StatusType]}`}>
      {text || children}
    </span>
  )
}

export default Tag
