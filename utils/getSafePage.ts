export function getSafePage(value: string | null | undefined, totalPages: number) {
  const raw = Number(value)
  if (!Number.isFinite(raw) || raw < 1) return 1
  return Math.min(raw, totalPages)
}
