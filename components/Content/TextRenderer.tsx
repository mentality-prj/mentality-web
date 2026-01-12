'use client'

type TextBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }

export function parseTextBlocks(input?: string): TextBlock[] {
  if (!input) return []
  const s = String(input).replace(/\r\n?/g, '\n').trim()
  if (!s) return []

  const lines = s.split('\n')
  const blocks: TextBlock[] = []

  let i = 0
  while (i < lines.length) {
    const line = lines[i as number].trim()

    if (!line) {
      i++
      continue
    }

    // Numbered or bulleted list
    const numberedMatch = line.match(/^\s*(\d+)[\.)]\s+(.*)/)
    const bulletMatch = line.match(/^\s*([-*•])\s+(.*)/)
    if (numberedMatch || bulletMatch) {
      const ordered = Boolean(numberedMatch)
      const items: string[] = []
      while (i < lines.length) {
        const l = lines[i as number].trim()
        if (!l) break
        const nm = l.match(/^\s*(\d+)[\.)]\s+(.*)/)
        const bm = l.match(/^\s*([-*•])\s+(.*)/)
        if (nm) {
          items.push(nm[2].trim())
        } else if (bm) {
          items.push(bm[2].trim())
        } else break
        i++
      }
      if (items.length) blocks.push({ type: 'list', ordered, items })
      continue
    }

    // Quote (lines starting with >)
    const quoteMatch = line.match(/^>\s?(.*)/)
    if (quoteMatch) {
      const parts: string[] = []
      while (i < lines.length) {
        const l = lines[i as number]
        const qm = l.trim().match(/^>\s?(.*)/)
        if (!qm) break
        parts.push(qm[1])
        i++
      }
      blocks.push({ type: 'quote', text: parts.join('\n') })
      continue
    }

    // Paragraph: collect until blank line or other block start
    const paraParts: string[] = []
    while (i < lines.length) {
      const l = lines[i as number]
      if (!l.trim()) break
      // stop if next is a list or quote marker
      if (/^\s*(\d+)[\.)]\s+/.test(l) || /^\s*[-*•]\s+/.test(l) || /^>\s?/.test(l)) break
      paraParts.push(l.trim())
      i++
    }
    if (paraParts.length) blocks.push({ type: 'paragraph', text: paraParts.join('\n') })
  }

  return blocks
}

export default function TextRenderer({ text }: { text?: string }) {
  const blocks = parseTextBlocks(text)
  if (!blocks.length) return null

  return (
    <div className="space-y-4">
      {blocks.map((b, idx) => {
        if (b.type === 'paragraph') {
          return (
            <p key={idx} className="whitespace-pre-line text-sm text-gray-800">
              {b.text}
            </p>
          )
        }
        if (b.type === 'quote') {
          return (
            <blockquote key={idx} className="border-l-2 pl-4 text-sm italic text-gray-700">
              {b.text}
            </blockquote>
          )
        }
        if (b.type === 'list') {
          return b.ordered ? (
            <ol key={idx} className="list-inside list-decimal text-sm text-gray-800">
              {b.items.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ol>
          ) : (
            <ul key={idx} className="list-inside list-disc text-sm text-gray-800">
              {b.items.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ul>
          )
        }
        return null
      })}
    </div>
  )
}
