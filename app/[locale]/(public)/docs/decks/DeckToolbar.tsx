'use client'

import { Download, Maximize2 } from 'lucide-react'

export function DeckToolbar({ printLabel, fullscreenLabel }: { printLabel: string; fullscreenLabel: string }) {
  return (
    <div className="dzvin-deck-toolbar sticky top-0 z-40 flex justify-end gap-3 border-b border-slate-200 bg-white/95 px-5 py-3 backdrop-blur">
      <button
        type="button"
        onClick={() => document.documentElement.requestFullscreen?.()}
        className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
      >
        <Maximize2 className="h-4 w-4" aria-hidden="true" />
        {fullscreenLabel}
      </button>
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex items-center gap-2 rounded-full bg-violet-700 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-800"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        {printLabel}
      </button>
    </div>
  )
}
