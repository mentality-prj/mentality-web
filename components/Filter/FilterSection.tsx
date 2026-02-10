'use client'

import { useId, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const panelId = `filter-section-${id}`
  const titleId = `filter-section-title-${id}`

  return (
    <div className="flex flex-col gap-sm">
      {/*
        Accessibility: The region must be labelled by the section title/button.
        Previously `aria-labelledby` pointed to the region's own id (panelId),
        which does not provide a label. Provide a distinct `titleId` on the
        title element and reference it from `aria-labelledby`. Keep
        `aria-controls` pointing to the panel (panelId).
      */}
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-left"
      >
        <span id={titleId}>{title}</span>
        {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>

      <div id={panelId} role="region" aria-labelledby={titleId} className={`${open ? 'block' : 'hidden'}`}>
        {children}
      </div>
    </div>
  )
}
