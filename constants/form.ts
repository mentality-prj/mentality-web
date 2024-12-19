export const months = [...Array(12)].map((_, index) => (index + 1).toString().padStart(2, '0'))
const currentYear = new Date().getFullYear()
export const years = Array.from({ length: 6 }, (_, index) => (currentYear + index).toString())
