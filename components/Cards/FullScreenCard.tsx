'use client'

import { ReactNode } from 'react'
import { X } from 'lucide-react'

import Card from '@/components/Cards/Card'
import FullScreenBackdrop from '@/components/FullScreenContainers/FullScreenBackdrop/FullScreenBackdrop'

interface FullScreenCardProps {
  type?: 'small' | 'default'
  title?: string
  text?: string
  children?: ReactNode
  createdAt?: string
  icon?: ReactNode
  tools?: ReactNode
  remark?: string
  tags?: string[]
  className?: string
  onClose: () => void
}

export default function FullScreenCard({
  type,
  title,
  text,
  children,
  createdAt,
  icon,
  tools,
  remark,
  tags,
  className = '',
  onClose,
}: FullScreenCardProps) {
  const maxWidthClass = type === 'small' ? 'max-w-lg' : 'max-w-3xl'

  return (
    <>
      <FullScreenBackdrop onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className={`w-full ${maxWidthClass}`}>
          <Card
            className={`p-6 ${className}`}
            sup={createdAt}
            icon={icon}
            tools={
              tools ?? (
                <button
                  type="button"
                  aria-label="Close"
                  onClick={onClose}
                  className="tool-icon tool-icon-text ml-4 rounded p-1"
                >
                  <X className="h-5 w-5" />
                </button>
              )
            }
            title={title}
            text={text}
            remark={remark}
            tags={tags}
          >
            {children}
          </Card>
        </div>
      </div>
    </>
  )
}
