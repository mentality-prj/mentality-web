import React, { ReactNode } from 'react'

import { Statuses, StatusType } from '../../types/status.types'
import Tag from '../Tag'

import { makeContainerClickHandler, makeContainerKeyDownHandler } from './helpers/cardHandlers'

interface CardProps {
  className?: string
  type?: StatusType
  icon?: ReactNode
  sup?: string
  title?: ReactNode
  text?: ReactNode
  aftertext?: ReactNode
  remark?: ReactNode
  children?: ReactNode
  tags?: string[]
  tools?: ReactNode | ReactNode[]
  onClick?: () => void
}

const darkTypes = [Statuses.dark, Statuses.accent, Statuses.warn, Statuses.error, Statuses.special, Statuses.support]
const whiteTypes = [Statuses.default, Statuses.ghost]

const Card = ({
  className = '',
  children,
  icon,
  remark,
  sup,
  text,
  aftertext,
  title,
  type = Statuses.default,
  tags,
  tools,
  onClick,
}: CardProps) => {
  const isDark = darkTypes.includes(type as (typeof darkTypes)[number])
  const textClass = isDark ? 'text-white' : ''
  const tagClass = !whiteTypes.includes(type as (typeof whiteTypes)[number]) ? 'tag-white' : 'tag'

  const handleContainerClick = makeContainerClickHandler(onClick)
  const handleContainerKeyDown = makeContainerKeyDownHandler(onClick)

  if (type) {
    return (
      <div
        onClick={handleContainerClick}
        onKeyDown={handleContainerKeyDown}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        className={`flex min-w-[140px] flex-col gap-1 rounded-2xl ${sup || tools ? 'px-6 pb-6 pt-2' : 'p-6'} ${Statuses[type as StatusType]} ${className}`}
      >
        {(sup || tools) && (
          <div className={`sup mt-2 flex h-3 items-center justify-between ${textClass}`}>
            <div className="flex items-center gap-1">
              {icon && icon}
              {sup && <div className="">{sup}</div>}
            </div>
            {tools && (
              <div className="flex gap-1.5" data-card-tools>
                {Array.isArray(tools) ? tools.map((tool, idx) => <span key={idx}>{tool}</span>) : tools}
              </div>
            )}
          </div>
        )}
        {title && <h3 className={`mb-0.5 text-xl ${textClass}`}>{title}</h3>}
        {text && <p className={textClass}>{text}</p>}
        {remark && <div className={`remark ${textClass}`}>{remark}</div>}
        {children}
        {aftertext && <p className={textClass}>{aftertext}</p>}
        {tags && (
          <div className="mt-auto flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Tag key={tag} text={tag} className={tagClass} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      onClick={handleContainerClick}
      onKeyDown={handleContainerKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`min-w-[140px] flex-1 rounded-2xl p-6 ${className}`}
    >
      {children}
    </div>
  )
}

export default Card
