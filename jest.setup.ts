import '@testing-library/jest-dom'
import '@testing-library/jest-dom/jest-globals'

// Suppress specific console errors in tests
const originalError = console.error
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    // Suppress React warnings about Server Actions (async functions) as form action prop
    const firstArg = args[0]
    if (
      typeof firstArg === 'string' &&
      (firstArg.includes('Invalid value for prop `action`') || firstArg.includes('attribute-behavior'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
