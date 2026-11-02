'use client'

import { Download, Maximize2 } from 'lucide-react'

export function DeckToolbar({ printLabel, fullscreenLabel }: { printLabel: string; fullscreenLabel: string }) {
  return (
    <div className="dzvin-deck-toolbar sticky top-0 z-40 grid grid-cols-2 gap-2 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:flex sm:justify-end sm:gap-3 sm:px-5">
      <button
        type="button"
        onClick={() => document.documentElement.requestFullscreen?.()}
        className="inline-flex min-w-0 items-center justify-center gap-2 rounded-full border border-slate-300 px-3 py-2 text-center text-xs font-semibold leading-tight text-slate-800 hover:bg-slate-100 sm:px-4 sm:text-sm"
      >
        <Maximize2 className="h-4 w-4 shrink-0" aria-hidden="true" />
        {fullscreenLabel}
      </button>
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex min-w-0 items-center justify-center gap-2 rounded-full bg-primary px-3 py-2 text-center text-xs font-semibold leading-tight text-primary-foreground hover:bg-primary-hover sm:px-4 sm:text-sm"
      >
        <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
        {printLabel}
      </button>
    </div>
  )
}
