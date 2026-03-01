'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import {
  buildRemainingText,
  findVoiceForLocale,
  htmlToPlainText,
  splitToChunksWithDelays,
} from '@/helpers/speech.helpers'
import { languageToLocale, SupportedLanguage } from '@/types/languages'

interface UseSpeechOptions {
  rate?: number
  pitch?: number
  volume?: number
}

export function useSpeech(options?: UseSpeechOptions) {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const [isSupported, setIsSupported] = useState(false)
  const queueRef = useRef<SpeechSynthesisUtterance[]>([])
  const currentIndexRef = useRef(0)
  const timerRef = useRef<number | null>(null)
  const pausedDuringDelayRef = useRef(false)
  const chunksRef = useRef<{ text: string; delay: number }[]>([])
  const currentLanguageRef = useRef<SupportedLanguage | null>(null)
  const currentCharIndexRef = useRef(0)
  const pausedByUserRef = useRef(false)
  const sessionRef = useRef(0)

  useEffect(() => {
    const supported = typeof window !== 'undefined' && 'speechSynthesis' in window
    setIsSupported(supported)
    if (!supported) return

    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices())
    }

    loadVoices()

    // Some browsers populate voices asynchronously
    window.speechSynthesis.onvoiceschanged = loadVoices

    return () => {
      window.speechSynthesis.onvoiceschanged = null
    }
  }, [])

  const mapLangToLocale = (lang: SupportedLanguage) => {
    // Prefer centralized mapping. If missing, build a reasonable fallback.
    const mapped = languageToLocale[lang as SupportedLanguage]
    if (mapped) return mapped
    return `${lang}-${lang.toUpperCase()}`
  }

  const speak = useCallback(
    (text: string, language: SupportedLanguage) => {
      if (!isSupported) return
      if (!text) return

      const locale = mapLangToLocale(language)

      // reset any existing speech
      window.speechSynthesis.cancel()
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      queueRef.current = []
      currentIndexRef.current = 0
      pausedDuringDelayRef.current = false

      // bump session id so any previous utterance callbacks ignore their events
      sessionRef.current += 1
      const mySession = sessionRef.current

      // sanitize input: strip HTML to avoid reading markup like lists/tags
      const cleanText = typeof text === 'string' ? htmlToPlainText(text) : String(text)
      // Ensure voices list is current (some browsers populate it lazily)
      if ((!voices || voices.length === 0) && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const loaded = window.speechSynthesis.getVoices() || []
        if (loaded.length > 0) {
          setVoices(loaded)
        }
      }

      const chunks = splitToChunksWithDelays(cleanText, options?.rate ?? 1)
      chunksRef.current = chunks
      currentLanguageRef.current = language
      // Use freshest voices list available synchronously; some browsers populate voices lazily
      const availableVoices =
        voices && voices.length > 0
          ? voices
          : typeof window !== 'undefined' && 'speechSynthesis' in window
            ? window.speechSynthesis.getVoices()
            : []
      if (availableVoices.length > 0 && (!voices || voices.length === 0)) {
        setVoices(availableVoices)
      }

      const utterances = chunks.map((c) => {
        const u = new SpeechSynthesisUtterance(c.text)
        // respect user-selected voice (saved in localStorage) if present
        let preferredName: string | null = null
        try {
          if (typeof window !== 'undefined') preferredName = localStorage.getItem('tts.voiceName')
        } catch {}

        let selectedVoice: SpeechSynthesisVoice | undefined
        if (preferredName) {
          selectedVoice = availableVoices.find((v) => v.name === preferredName)
        }
        // otherwise pick by locale (if available)
        if (!selectedVoice) selectedVoice = findVoiceForLocale(availableVoices, locale)
        if (selectedVoice) u.voice = selectedVoice
        u.lang = locale
        u.rate = options?.rate ?? 1
        u.pitch = options?.pitch ?? 1
        u.volume = options?.volume ?? 1

        // track boundary events (word/char) when supported to allow precise resume
        // note: not all voices/browsers emit boundary events; fallback exists
        u.onboundary = (ev: SpeechSynthesisEvent) => {
          // ev.charIndex is the index within the utterance text
          if (typeof ev.charIndex === 'number' && ev.charIndex > 0) {
            currentCharIndexRef.current = ev.charIndex
          }
        }
        return u
      })

      if (utterances.length === 0) return

      // mark speaking early so UI reflects state immediately
      setIsSpeaking(true)
      setIsPaused(false)

      // Small diagnostic log to help debug voice selection and input text
      try {
        // eslint-disable-next-line no-console
        console.debug('[useSpeech] speak start', {
          locale,
          voiceForLocale: findVoiceForLocale(voices, locale)?.name,
          textPreview: cleanText.slice(0, 120),
        })
      } catch {}

      utterances.forEach((u, idx) => {
        u.onstart = () => {
          if (sessionRef.current !== mySession) return
          // mark which utterance is currently running
          currentIndexRef.current = idx
          // reset char index for this utterance
          currentCharIndexRef.current = 0
          setIsSpeaking(true)
          setIsPaused(false)
          pausedByUserRef.current = false
        }

        u.onend = () => {
          if (sessionRef.current !== mySession) return
          const next = idx + 1
          if (next < utterances.length) {
            currentIndexRef.current = next
            // use delay determined for the current chunk (idx)
            const delay = chunks[idx as number]?.delay ?? 100
            timerRef.current = window.setTimeout(() => {
              timerRef.current = null
              if (!pausedDuringDelayRef.current) {
                const nextUt = utterances[next as number]
                utteranceRef.current = nextUt
                window.speechSynthesis.speak(nextUt)
              }
            }, delay)
          } else {
            setIsSpeaking(false)
            setIsPaused(false)
            queueRef.current = []
            currentIndexRef.current = 0
          }
        }

        u.onerror = () => {
          if (sessionRef.current !== mySession) return
          setIsSpeaking(false)
          setIsPaused(false)
          queueRef.current = []
          currentIndexRef.current = 0
        }
      })

      queueRef.current = utterances
      utteranceRef.current = utterances[0]
      window.speechSynthesis.speak(utterances[0])
    },
    [voices, isSupported, options]
  )

  const pause = useCallback(() => {
    if (!isSupported) return
    // If speech is currently playing, pause the SpeechSynthesis (preserves position)
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      try {
        window.speechSynthesis.pause()
      } catch (e) {
        // ignore
      }
      pausedDuringDelayRef.current = false
      pausedByUserRef.current = true
      setIsPaused(true)
      return
    }

    // If we're in the inter-chunk delay, clear the timer and mark pausedDuringDelay
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
      pausedDuringDelayRef.current = true
      pausedByUserRef.current = false
      setIsPaused(true)
    }
  }, [isSupported])

  const resume = useCallback(() => {
    if (!isSupported) return

    // If native engine thinks it's paused and we paused it, try native resume first
    if (pausedByUserRef.current && typeof window !== 'undefined' && window.speechSynthesis.paused) {
      try {
        window.speechSynthesis.resume()
        setIsPaused(false)
        setIsSpeaking(true)
        pausedByUserRef.current = false
        pausedDuringDelayRef.current = false
        return
      } catch (e) {
        // ignore and fallback
      }
    }

    // If paused between chunks, restart remaining chunks
    if (pausedDuringDelayRef.current) {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      pausedDuringDelayRef.current = false
      setIsPaused(false)
      setIsSpeaking(true)
      const idx = currentIndexRef.current
      const remainingChunks = chunksRef.current.slice(idx)
      const remainingText = remainingChunks.map((c) => c.text).join(' ')
      const lang = currentLanguageRef.current
      if (remainingText && lang) {
        window.setTimeout(() => speak(remainingText, lang), 20)
      }
      return
    }

    // As a robust fallback: if we paused during an utterance but native resume didn't work,
    // try to restart remaining text from the last known charIndex (onboundary)
    if (pausedByUserRef.current) {
      const idx = currentIndexRef.current
      const currentUt = utteranceRef.current
      const charIdx = currentCharIndexRef.current || 0
      const remainingText = buildRemainingText(chunksRef.current, idx, currentUt?.text as string | undefined, charIdx)
      const lang = currentLanguageRef.current
      pausedByUserRef.current = false
      setIsPaused(false)
      setIsSpeaking(true)
      if (remainingText && lang) {
        window.setTimeout(() => speak(remainingText, lang), 20)
      }
      return
    }

    setIsPaused(false)
  }, [isSupported, speak])

  const stop = useCallback(() => {
    if (!isSupported) return
    window.speechSynthesis.cancel()
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    queueRef.current = []
    currentIndexRef.current = 0
    pausedDuringDelayRef.current = false
    setIsSpeaking(false)
    setIsPaused(false)
    utteranceRef.current = null
  }, [isSupported])

  return {
    speak,
    pause,
    resume,
    stop,
    isSpeaking,
    isPaused,
    voices,
    isSupported,
  }
}
