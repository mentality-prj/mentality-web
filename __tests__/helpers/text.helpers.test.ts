import { wrapInAngleQuotes } from '@/helpers/text.helpers'

describe('text.helpers', () => {
  describe('wrapInAngleQuotes', () => {
    it('wraps simple text in angle quotes', () => {
      expect(wrapInAngleQuotes('hello')).toBe('«hello»')
    })

    it('preserves the original text when empty', () => {
      expect(wrapInAngleQuotes('')).toBe('«»')
    })

    it('works with text that already contains quotes', () => {
      expect(wrapInAngleQuotes('«inner»')).toBe('««inner»»')
    })
  })
})
