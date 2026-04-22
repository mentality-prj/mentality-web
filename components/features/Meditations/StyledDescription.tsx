type Props = {
  text: string
}

type NumberedItem = { num: string; text: string }

function endsWithSentencePunctuation(text: string) {
  return /[.!?…]$/.test(text)
}

function ensureSentenceEnding(text: string) {
  return endsWithSentencePunctuation(text) ? text : `${text}.`
}

function isWhitespace(char: string | undefined) {
  return char === ' ' || char === '\n' || char === '\t' || char === '\r'
}

function isDigit(char: string | undefined) {
  if (!char) return false
  const code = char.charCodeAt(0)
  return code >= 48 && code <= 57
}

function isUppercaseLetter(char: string | undefined) {
  if (!char) return false
  return char.toUpperCase() === char && char.toLowerCase() !== char
}

function findStepBoundaries(text: string) {
  const boundaries = [0]

  for (let index = 1; index < text.length; index++) {
    const previousChar = text.charAt(index - 1)
    const isSentenceBoundary =
      previousChar === '.' || previousChar === '!' || previousChar === '?' || previousChar === '…'
    const isLineBoundary = previousChar === '\n'

    if (!isSentenceBoundary && !isLineBoundary) continue

    let cursor = index
    while (isWhitespace(text.charAt(cursor))) cursor++

    const numberStart = cursor
    while (cursor < text.length && isDigit(text.charAt(cursor))) cursor++
    if (cursor === numberStart) continue

    const number = text.slice(numberStart, cursor)

    if (text.charAt(cursor) === '.') {
      cursor++
      if (!isWhitespace(text.charAt(cursor))) continue
      if (numberStart > 0) boundaries.push(numberStart)
      continue
    }

    if (number.length !== 1) continue
    if (!isWhitespace(text.charAt(cursor))) continue

    while (isWhitespace(text.charAt(cursor))) cursor++
    if (!isUppercaseLetter(text.charAt(cursor))) continue

    if (numberStart > 0) boundaries.push(numberStart)
  }

  return boundaries
}

export function parseNumberedList(text: string): NumberedItem[] | null {
  const normalizedText = text.replace(/\r\n?/g, '\n').trim()
  if (!normalizedText) return null

  const parts = findStepBoundaries(normalizedText)
    .map((start, index, boundaries) =>
      normalizedText.slice(start, boundaries[index + 1] ?? normalizedText.length).trim()
    )
    .filter(Boolean)
  if (parts.length === 0) return null

  const items: NumberedItem[] = []
  const startsWithNumber = /^\d+\.\s+/.test(parts[0] as string)

  for (let idx = 0; idx < parts.length; idx++) {
    const part = parts[idx as number]
    if (idx === 0 && !startsWithNumber && isDigit(part.charAt(0))) return null

    const m = part.match(/^(\d+)(?:\.\s+|\s+)([\s\S]+)$/)
    if (m) {
      items.push({ num: m[1], text: m[2].trim().replace(/\.$/, '') })
    } else if (idx === 0) {
      const clean = part.trim().replace(/\.$/, '')
      if (clean) items.push({ num: '1', text: clean })
    } else {
      return null
    }
  }

  if (!startsWithNumber) {
    if (items.length < 3) return null
    if (items[1]?.num !== '2' || items[2]?.num !== '3') return null
  }

  return items.length > 0 ? items : null
}

export const StyledDescription = ({ text }: Props) => {
  const items = parseNumberedList(text)

  if (items) {
    return (
      <ol className="list-none space-y-2 pl-0 text-base leading-relaxed">
        {items.map(({ num, text: itemText }, index) => (
          <li key={`${num}-${index}`} className="flex gap-2 text-base leading-relaxed">
            <span aria-hidden="true" className="shrink-0 font-medium">
              {num}.
            </span>
            <span>{ensureSentenceEnding(itemText)}</span>
          </li>
        ))}
      </ol>
    )
  }

  return <p className="text-base leading-relaxed">{text}</p>
}
