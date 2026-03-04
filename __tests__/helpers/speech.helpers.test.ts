import {
  buildRemainingText,
  findVoiceForLocale,
  htmlToPlainText,
  splitToChunksWithDelays,
} from '@/helpers/speech.helpers'

// ---------------------------------------------------------------------------
// splitToChunksWithDelays
// ---------------------------------------------------------------------------
describe('splitToChunksWithDelays', () => {
  it('returns a single chunk for plain text without punctuation', () => {
    const chunks = splitToChunksWithDelays('hello world')
    expect(chunks).toHaveLength(1)
    expect(chunks[0].text).toBe('hello world')
  })

  it('splits on sentence-ending punctuation', () => {
    const chunks = splitToChunksWithDelays('Hello. How are you? I am fine!')
    expect(chunks.length).toBeGreaterThan(1)
    // Every chunk should have non-empty text
    chunks.forEach((c) => expect(c.text.length).toBeGreaterThan(0))
  })

  it('assigns a longer delay (350 ms at rate=1) after sentence-ending punctuation', () => {
    const chunks = splitToChunksWithDelays('Hello. World')
    const sentenceChunk = chunks.find((c) => c.text.endsWith('.'))
    expect(sentenceChunk).toBeDefined()
    expect(sentenceChunk!.delay).toBe(350)
  })

  it('assigns a shorter delay after a comma', () => {
    const chunks = splitToChunksWithDelays('Hello, world')
    const commaChunk = chunks.find((c) => c.text.endsWith(','))
    expect(commaChunk).toBeDefined()
    expect(commaChunk!.delay).toBe(140)
  })

  it('scales delay inversely with rate', () => {
    const slow = splitToChunksWithDelays('Hello. World', 0.5)
    const fast = splitToChunksWithDelays('Hello. World', 2)
    const slowDelay = slow.find((c) => c.text.endsWith('.'))!.delay
    const fastDelay = fast.find((c) => c.text.endsWith('.'))!.delay
    expect(slowDelay).toBeGreaterThan(fastDelay)
  })

  it('never produces a delay below 60 ms', () => {
    const chunks = splitToChunksWithDelays('a b c', 100)
    chunks.forEach((c) => expect(c.delay).toBeGreaterThanOrEqual(60))
  })

  it('handles empty string gracefully', () => {
    const chunks = splitToChunksWithDelays('')
    // Empty or single chunk – no throw
    expect(Array.isArray(chunks)).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// findVoiceForLocale
// ---------------------------------------------------------------------------
const makeVoice = (name: string, lang: string) => ({ name, lang }) as SpeechSynthesisVoice

describe('findVoiceForLocale', () => {
  const voices = [
    makeVoice('Google UK English', 'en-GB'),
    makeVoice('Google US English', 'en-US'),
    makeVoice('Paulina', 'pl-PL'),
  ]

  it('returns undefined for empty voices array', () => {
    expect(findVoiceForLocale([], 'en-US')).toBeUndefined()
  })

  it('returns undefined for undefined voices', () => {
    expect(findVoiceForLocale(undefined, 'en-US')).toBeUndefined()
  })

  it('returns exact match when available', () => {
    const result = findVoiceForLocale(voices, 'pl-PL')
    expect(result?.name).toBe('Paulina')
  })

  it('returns first language-prefix match when no exact match', () => {
    // 'en-AU' has no exact match; should fall back to a voice with lang starting 'en'
    const result = findVoiceForLocale(voices, 'en-AU')
    expect(result?.lang.startsWith('en')).toBe(true)
  })

  it('returns undefined when neither exact nor prefix matches', () => {
    const result = findVoiceForLocale(voices, 'ja-JP')
    expect(result).toBeUndefined()
  })
})

// ---------------------------------------------------------------------------
// buildRemainingText
// ---------------------------------------------------------------------------
describe('buildRemainingText', () => {
  const chunks = [
    { text: 'Hello world', delay: 100 },
    { text: 'how are you', delay: 100 },
    { text: 'I am fine', delay: 100 },
  ]

  it('returns all chunk text when currentIndex is 0 and no partial utterance', () => {
    const result = buildRemainingText(chunks, 0)
    expect(result).toContain('Hello world')
    expect(result).toContain('how are you')
    expect(result).toContain('I am fine')
  })

  it('slices the current utterance text using charIndex', () => {
    // charIndex=6 means we already spoke "Hello " — remaining is "world"
    const result = buildRemainingText(chunks, 0, 'Hello world', 6)
    expect(result).toContain('world')
    expect(result).not.toMatch(/^Hello world/)
  })

  it('excludes already-finished chunks', () => {
    // currentIndex=2 means chunks 0 and 1 are done
    const result = buildRemainingText(chunks, 2)
    expect(result).toContain('I am fine')
    expect(result).not.toContain('Hello world')
  })

  it('returns remaining chunks from currentIndex when current utterance is fully consumed', () => {
    // When charIndex equals the utterance length, slice(9) = '' so remainingCurrent
    // is falsy — the function re-includes chunk[currentIndex] onward as a fallback.
    // This matches the implementation's design: an empty remainingCurrent means
    // "no partial utterance provided", so we start from currentIndex.
    const result = buildRemainingText(chunks, 2, 'I am fine', 9)
    expect(result).toContain('I am fine')
  })
})

// ---------------------------------------------------------------------------
// htmlToPlainText
// ---------------------------------------------------------------------------
describe('htmlToPlainText', () => {
  it('returns empty string for empty input', () => {
    expect(htmlToPlainText('')).toBe('')
  })

  it('strips simple HTML tags (server-side fallback path)', () => {
    // Force the server-side code path by temporarily removing window so that
    // the DOM-based branch is unavailable and the regex-based fallback is used.
    const original = global.window
    try {
      // Temporarily hide window to force the regex fallback
      ;(global as Record<string, unknown>).window = undefined
      const result = htmlToPlainText('<p>Hello <strong>world</strong></p>')
      expect(result).not.toContain('<p>')
      expect(result).not.toContain('<strong>')
      expect(result).toContain('Hello')
      expect(result).toContain('world')
    } finally {
      ;(global as Record<string, unknown>).window = original
    }
  })

  it('handles plain text input without modification', () => {
    const text = 'Just plain text'
    expect(htmlToPlainText(text)).toBe(text)
  })
})
