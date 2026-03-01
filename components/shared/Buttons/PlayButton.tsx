'use client'

import { Pause, Play, Square as Stop } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { useSpeech } from '@/hooks/useSpeech'
import { SupportedLanguage } from '@/types/languages'
import { Button } from '@/ui/button'

interface Props {
  text: string
  language: SupportedLanguage
}

export function PlayButton({ text, language }: Props) {
  const t = useTranslations('components.PlayButton')
  const { speak, pause, resume, stop, isSpeaking, isPaused, isSupported } = useSpeech({ rate: 0.85 })
  const handleClick = () => {
    if (!isSupported) return
    if (!isSpeaking) {
      speak(text, language)
      return
    }

    if (isPaused) resume()
    else pause()
  }

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation()
    stop()
  }

  const title = !isSupported ? t('speechNotSupported') : !isSpeaking ? t('play') : isPaused ? t('resume') : t('pause')

  if (!isSupported) {
    return null
  }

  return (
    <>
      <Button
        variant="iconTool"
        onClick={(e) => {
          e.stopPropagation()
          handleClick()
        }}
        aria-label={title}
        title={title}
      >
        {!isSpeaking && <Play size={16} />}
        {isSpeaking && !isPaused && <Pause size={16} />}
        {isSpeaking && isPaused && <Play size={16} />}
      </Button>

      {isSpeaking && (
        <Button variant="iconTool" onClick={handleStop} aria-label={t('stop')} title={t('stop')}>
          <Stop size={16} />
        </Button>
      )}
    </>
  )
}
