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

// Polyfill for HTMLFormElement.prototype.requestSubmit (only in jsdom environment)
if (typeof HTMLFormElement !== 'undefined') {
  Object.defineProperty(HTMLFormElement.prototype, 'requestSubmit', {
    writable: true,
    configurable: true,
    value: function (submitter?: HTMLElement) {
      if (submitter) {
        const form = (submitter as HTMLInputElement | HTMLButtonElement).form
        if (form !== this) {
          throw new DOMException('The specified element is not owned by this form element', 'NotFoundError')
        }
        const type = (submitter as HTMLInputElement | HTMLButtonElement).type
        if (type !== 'submit') {
          throw new TypeError('The specified element is not a submit button')
        }
      }

      // Create and dispatch a submit event
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
      const cancelled = !this.dispatchEvent(submitEvent)

      if (!cancelled) {
        this.submit()
      }
    },
  })
}
