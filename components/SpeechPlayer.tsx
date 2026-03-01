'use client'

import { SupportedLanguage } from '@/types/languages'

import { useSpeech } from '../hooks/useSpeech'

interface Props {
  text: string
  locale: SupportedLanguage
}

export function SpeechPlayer({ text, locale }: Props) {
  const { speak, pause, resume, stop, isSpeaking, isPaused, isSupported } = useSpeech()

  if (!isSupported) {
    return <div>SpeechSynthesis not supported in this browser.</div>
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <button onClick={() => speak(text, locale)}>▶ Play</button>

      <button onClick={pause} disabled={!isSpeaking || isPaused}>
        ⏸ Pause
      </button>

      <button onClick={resume} disabled={!isPaused}>
        ⏯ Resume
      </button>

      <button onClick={stop} disabled={!isSpeaking}>
        ⏹ Stop
      </button>
    </div>
  )
}
