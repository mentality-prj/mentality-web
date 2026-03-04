'use client'

import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

import { Button } from '@/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/ui/dropdown-menu'

export function VoiceSelector() {
  const t = useTranslations('components.VoiceSelector')
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selected, setSelected] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('tts.voiceName')
  })

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

    const load = () => {
      const v = window.speechSynthesis.getVoices() || []
      // clone to avoid holding browser-internal references
      setVoices(Array.from(v))
      const saved = localStorage.getItem('tts.voiceName')
      if (saved) setSelected(saved)
    }

    load()
    // some browsers populate voices asynchronously; listen for the event and also retry once after a short delay
    try {
      window.speechSynthesis.addEventListener?.('voiceschanged', load)
    } catch {}
    const timer = window.setTimeout(load, 500)

    return () => {
      try {
        window.speechSynthesis.removeEventListener?.('voiceschanged', load)
      } catch {}
      clearTimeout(timer)
    }
  }, [])

  const handleSelect = (name?: string) => {
    const v = name || null
    setSelected(v)
    try {
      if (typeof window !== 'undefined') {
        if (v) localStorage.setItem('tts.voiceName', v)
        else localStorage.removeItem('tts.voiceName')
      }
    } catch {}
  }

  const triggerLabel = selected ? `${selected}` : t('autoLabel')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">
          {t('label')}: {triggerLabel} ▾
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[220px] bg-white">
        <DropdownMenuItem className="px-4 py-1" onSelect={() => handleSelect(undefined)}>
          {t('autoOption')}
        </DropdownMenuItem>
        {voices.length === 0 ? (
          <DropdownMenuItem disabled>{t('noVoicesAvailable')}</DropdownMenuItem>
        ) : (
          voices.map((v) => (
            <DropdownMenuItem key={`${v.name}::${v.lang}`} className="px-4 py-1" onSelect={() => handleSelect(v.name)}>
              {`${v.name} — ${v.lang}`}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
