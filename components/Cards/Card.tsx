import { ReactNode } from 'react'

import { Statuses, StatusType } from '../../types/status.types'
import Tag from '../Tag'

interface CardProps {
  className?: string
  type?: StatusType
  icon?: ReactNode
  sup?: string
  title?: string
  text?: string
  remark?: string
  children?: ReactNode
  tags?: string[]
  tools?: ReactNode | ReactNode[]
}

const Card = ({
  className = '',
  children,
  icon,
  remark,
  sup,
  text,
  title,
  type = 'default',
  tags,
  tools,
}: CardProps) => {
  if (type) {
    return (
      <div
        className={`flex min-w-[140px] flex-col gap-1 rounded-2xl ${sup ? 'px-6 pb-6 pt-2' : 'p-6'} ${Statuses[type as StatusType]} ${className}`}
      >
        {sup && (
          <div className="sup mt-2 flex h-3 items-center justify-between">
            <div className="flex items-center gap-1">
              {icon && icon}
              <div className="">{sup}</div>
            </div>
            {tools && <div className="flex gap-1.5">{tools}</div>}
          </div>
        )}
        {title && <h3 className="mb-0.5 text-xl font-bold">{title}</h3>}
        {text && <p>{text}</p>}
        {remark && <div className="remark">{remark}</div>}
        {children}
        {tags && (
          <div className="mt-auto flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Tag key={tag} text={tag} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return <div className={`min-w-[140px] flex-1 rounded-2xl p-6 ${className}`}>{children}</div>
}

export default Card
