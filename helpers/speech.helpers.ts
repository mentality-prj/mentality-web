export interface SpeechChunk {
  text: string
  delay: number
}

/**
 * Split text into chunks and calculate an inter-chunk delay based on punctuation and rate.
 * Kept as a pure helper so it can be reused and tested separately.
 */
export function splitToChunksWithDelays(text: string, rate = 1): SpeechChunk[] {
  const re = /[^,;:\-—–.!?]+[,;:\-—–.!?]*[)\]"'’”]*|.+$/g
  const parts = text.match(re) || [text]

  return parts
    .map((p) => p.trim())
    .filter(Boolean)
    .map((chunk) => {
      const lastChar = chunk.slice(-1)
      let baseDelay = 80
      if (['.', '!', '?'].includes(lastChar)) baseDelay = 350
      else if ([',', ';'].includes(lastChar)) baseDelay = 140
      else if ([':', '—', '–', '-'].includes(lastChar)) baseDelay = 180
      else baseDelay = 90

      const delay = Math.max(60, Math.round(baseDelay * (1 / (rate || 1))))
      return { text: chunk, delay }
    })
}

/**
 * Find the best matching voice for a BCP-47 locale. Prefers exact match, then language prefix.
 */
export function findVoiceForLocale(voices: SpeechSynthesisVoice[] | undefined, locale: string) {
  if (!voices || voices.length === 0) return undefined
  const exact = voices.find((v) => v.lang === locale)
  if (exact) return exact
  const lang = locale.split('-')[0]
  return voices.find((v) => v.lang.startsWith(lang))
}

/**
 * Build remaining text from current utterance position and remaining chunks.
 * Returns a single string representing what should be spoken next.
 */
export function buildRemainingText(chunks: SpeechChunk[], currentIndex: number, currentUtText?: string, charIndex = 0) {
  const remainingCurrent = currentUtText && typeof currentUtText === 'string' ? currentUtText.slice(charIndex) : ''
  const remainingChunks = chunks.slice(currentIndex + (remainingCurrent ? 1 : 0))
  return [remainingCurrent, ...remainingChunks.map((c) => c.text)].filter(Boolean).join(' ')
}

/**
 * Convert an HTML string to plain text. Uses DOMParser in the browser and
 * falls back to a simple tag-stripper on the server.
 */
export function htmlToPlainText(input: string): string {
  if (!input) return ''
  if (typeof window !== 'undefined' && 'DOMParser' in window) {
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(input, 'text/html')
      return doc.body.textContent || ''
    } catch (e) {
      // fallback
    }
  }
  return input.replace(/<[^>]+>/g, ' ')
}
