/** @jest-environment jsdom */
import { createLeadSubmissionId } from './createLeadSubmissionId'

describe('opaque business and research submission IDs', () => {
  it('creates an RFC 4122 v4 UUID without embedding personal information', () => {
    const value = createLeadSubmissionId()
    expect(value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    expect(createLeadSubmissionId()).not.toBe(value)
  })
})
