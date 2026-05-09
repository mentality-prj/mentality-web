'use client'

import { ReactNode } from 'react'
import { Calendar, Clock, SquareArrowOutUpRight } from 'lucide-react'

import { Tag } from '@/ds/components/Tag'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { darkTypes, Statuses, StatusType, whiteTypes } from '@/types/status.types'

import { makeContainerClickHandler, makeContainerKeyDownHandler } from './helpers/cardHandlers'

interface CardProps {
  className?: string
  type?: StatusType
  icon?: ReactNode
  sup?: string | ReactNode | ReactNode[]
  date?: string
  time?: string
  title?: ReactNode
  subtitle?: ReactNode
  text?: ReactNode
  aftertext?: ReactNode
  remark?: ReactNode
  children?: ReactNode
  tags?: string[]
  tools?: ReactNode | ReactNode[]
  hideLinkIndicator?: boolean
  link?: string
  linkText?: string
  onClick?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

const Card = ({
  className = '',
  children,
  icon,
  remark,
  sup,
  date,
  time,
  text,
  aftertext,
  title,
  subtitle,
  type = Statuses.default,
  tags,
  tools,
  hideLinkIndicator = false,
  link,
  linkText,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: CardProps) => {
  const isDark = darkTypes.includes(type as (typeof darkTypes)[number])
  const textClass = isDark ? 'text-white' : ''
  const tagClass = !whiteTypes.includes(type as (typeof whiteTypes)[number]) ? 'tag-white' : 'tag'

  const handleContainerClick = makeContainerClickHandler(onClick)
  const handleContainerKeyDown = makeContainerKeyDownHandler(onClick)

  if (type) {
    const cardDiv = (
      <div
        onClick={link ? undefined : handleContainerClick}
        onKeyDown={link ? undefined : handleContainerKeyDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        role={!link && onClick ? 'button' : undefined}
        tabIndex={!link && onClick ? 0 : undefined}
        className={cn(
          'relative flex flex-col gap-1.5 rounded-2xl',
          sup || tools || date || time ? 'px-6 pb-6 pt-2' : 'p-6',
          Statuses[type as StatusType],
          (link || onClick) && 'cursor-pointer transition-shadow hover:shadow-[0_4px_14px_0_hsl(var(--primary)/0.35)]',
          className
        )}
      >
        {link && (
          <Link
            href={link}
            className="absolute inset-0 rounded-2xl"
            aria-label={typeof title === 'string' ? title : typeof text === 'string' ? text : undefined}
          />
        )}
        {(sup || tools || date || time || link || onClick) && (
          <div className={`sup mt-2 flex h-3 items-center justify-between ${textClass}`}>
            <div className="flex items-center gap-2">
              {icon && icon}
              {sup && <div className="">{sup}</div>}
              {date && (
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>{date}</span>
                </div>
              )}
              {time && (
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{time}</span>
                </div>
              )}
            </div>
            <div className={`relative z-10 flex gap-1 ${isDark ? 'tools-dark' : ''}`} data-card-tools>
              {tools && (Array.isArray(tools) ? tools.map((tool, idx) => <span key={idx}>{tool}</span>) : tools)}
              {!hideLinkIndicator && (link || onClick) && (
                <span className={cn('flex items-center gap-1 opacity-65', link && 'pointer-events-none')}>
                  {linkText}
                  <SquareArrowOutUpRight size={16} />
                </span>
              )}
            </div>
          </div>
        )}
        {title && (
          <div className="flex items-start justify-between gap-2">
            <h3 className={`mb-0.5 text-xl ${textClass}`}>{title}</h3>
          </div>
        )}
        {subtitle && <h4 className={`text-sm ${textClass}`}>{subtitle}</h4>}
        {text && <p className={textClass}>{text}</p>}
        {remark && <div className={`remark ${textClass}`}>{remark}</div>}
        {children}
        {aftertext && <p className={textClass}>{aftertext}</p>}
        {tags && (
          <div className="mt-auto flex flex-wrap gap-xs">
            {tags.map((tag) => (
              <Tag key={tag} text={tag} className={tagClass} />
            ))}
          </div>
        )}
      </div>
    )
    return cardDiv
  }

  return (
    <div
      onClick={handleContainerClick}
      onKeyDown={handleContainerKeyDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`flex-1 rounded-2xl p-6 ${className}`}
    >
      {children}
    </div>
  )
}

export default Card
