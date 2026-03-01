'use client'

import { useState } from 'react'

import { PlayButton } from '@/components/shared/Buttons/PlayButton'
import StyledTextarea from '@/components/shared/Forms/StyledTextarea'
import { VoiceSelector } from '@/components/shared/VoiceSelector'
import { SupportedLanguage, supportedLanguages } from '@/types/languages'
import { Button } from '@/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/ui/dropdown-menu'

const samples: Record<SupportedLanguage, string> = {
  uk: 'Привіт! Це тест української мови.',
  en: 'Hello! This is a short English test.',
  pl: 'Cześć! To jest test języka polskiego.',
}

export default function SpeechDemoPage() {
  const [locale, setLocale] = useState<SupportedLanguage>(supportedLanguages[0])
  const [text, setText] = useState<string>(samples[supportedLanguages[0]])

  return (
    <main style={{ padding: 24 }}>
      <h1>Speech demo</h1>

      <div className="my-4 flex flex-col items-start gap-sm sm:flex-row sm:items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">Language: {locale} ▾</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-[160px] bg-white">
            {supportedLanguages.map((l) => (
              <DropdownMenuItem
                key={l}
                className="px-4 py-1"
                onSelect={() => {
                  setLocale(l)
                  setText(samples[l as SupportedLanguage])
                }}
              >
                {l}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <VoiceSelector />
      </div>

      <div>
        <StyledTextarea value={text} onChange={(e) => setText(e.target.value)} />
      </div>

      <div className="mt-4">
        <PlayButton text={text} language={locale} />
      </div>
    </main>
  )
}
