export function getPages(page: number, totalPages: number) {
  const delta = 1

  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const range: (number | '...')[] = []
  const rangeWithDots: (number | '...')[] = []

  let left = Math.max(2, page - delta)
  let right = Math.min(totalPages - 1, page + delta)

  if (page <= 3) {
    left = 2
    right = 4
  }

  if (page >= totalPages - 2) {
    left = totalPages - 3
    right = totalPages - 1
  }

  for (let i = left; i <= right; i++) {
    range.push(i)
  }

  rangeWithDots.push(1)

  if (left > 2) {
    rangeWithDots.push('...')
  }

  rangeWithDots.push(...range)

  if (right < totalPages - 1) {
    rangeWithDots.push('...')
  }

  rangeWithDots.push(totalPages)

  return rangeWithDots
}
