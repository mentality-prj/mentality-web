import { decodeRiskEventFeed } from './riskFeed.contract'

describe('risk feed response contract', () => {
  it('accepts real events in both supported response shapes', () => {
    expect(decodeRiskEventFeed([{ eventId: 'risk-1', signal: 'High stress' }])).toHaveLength(1)
    expect(decodeRiskEventFeed({ items: [{ id: 'risk-2', title: 'Low energy' }], total: 1 })).toHaveLength(1)
    expect(decodeRiskEventFeed([])).toEqual([])
    expect(decodeRiskEventFeed({ items: [], total: 0 })).toEqual([])
  })

  it('rejects malformed collections rather than treating them as empty data', () => {
    const invalid = [null, {}, { items: null }, { items: 'invalid' }, { items: [null] }, [{ id: 'risk-1' }, false]]
    for (const value of invalid) {
      expect(decodeRiskEventFeed(value)).toBeNull()
    }
  })

  it('rejects events with missing identifiers and titles', () => {
    expect(decodeRiskEventFeed([{ unrelatedField: true }])).toBeNull()
    expect(decodeRiskEventFeed([{ title: '' }])).toBeNull()
  })
})
