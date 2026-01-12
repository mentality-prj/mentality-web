export function parseSteps(text?: string): string[] {
  if (!text) return []
  const s = String(text)
    .replace(/\r\n?/g, '\n')
    // ensure numbered markers become line starters: '1.' or '1)'
    .replace(/(\d+)[\.\)]\s*/g, '\n$1. ')

  // Split on blank lines or single newlines
  const parts = s
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)

  // Remove leading numeric markers like '1.' from each part
  return parts.map((p) => p.replace(/^\d+[\.\)]\s*/, '').trim()).filter(Boolean)
}

export default parseSteps
