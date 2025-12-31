import { ReactNode } from 'react'

import { Statuses, StatusType } from '../../types/status.types'
import Tag from '../Tag'

interface CardProps {
  className?: string
  type?: StatusType
  icon?: ReactNode
  sup?: string
  title?: ReactNode
  text?: ReactNode
  remark?: ReactNode
  children?: ReactNode
  tags?: string[]
  tools?: ReactNode | ReactNode[]
}

const darkTypes = [Statuses.dark, Statuses.accent, Statuses.warn, Statuses.error, Statuses.special]

const Card = ({
  className = '',
  children,
  icon,
  remark,
  sup,
  text,
  title,
  type = Statuses.default,
  tags,
  tools,
}: CardProps) => {
  const isDark = darkTypes.includes(type as (typeof darkTypes)[number])
  const textClass = isDark ? 'text-white' : ''

  if (type) {
    return (
      <div
        className={`flex min-w-[140px] flex-col gap-1 rounded-2xl ${sup ? 'px-6 pb-6 pt-2' : 'p-6'} ${Statuses[type as StatusType]} ${className}`}
      >
        {sup && (
          <div className={`sup mt-2 flex h-3 items-center justify-between ${textClass}`}>
            <div className="flex items-center gap-1">
              {icon && icon}
              <div className="">{sup}</div>
            </div>
            {tools && (
              <div className="flex gap-1.5">
                {Array.isArray(tools) ? tools.map((tool, idx) => <span key={idx}>{tool}</span>) : tools}
              </div>
            )}
          </div>
        )}
        {title && <h3 className={`mb-0.5 text-xl font-bold ${textClass}`}>{title}</h3>}
        {text && <p className={textClass}>{text}</p>}
        {remark && <div className={`remark ${textClass}`}>{remark}</div>}
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
