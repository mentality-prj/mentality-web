import {
  createResearchExportDecoder,
  createResearchInspectionDecoder,
  decodeResearchCohortResponse,
  decodeResearchHistoryResponse,
} from './researchOperationalResponses'

const exportRequest = { format: 'csv', requestedFields: ['stressScore'], reason: 'Approved review' }

describe('Research operational HTTP response contracts', () => {
  it('accepts absent cohorts while rejecting malformed or ambiguous success payloads', () => {
    for (const value of [null, undefined, []]) {
      expect(decodeResearchCohortResponse(value)).toEqual({ success: true, data: null })
    }

    for (const value of [
      {},
      { groupIds: 'invalid' },
      { dateRange: {} },
      { dateRange: null },
      { dateRange: { other: 'field' } },
      [{}, {}],
      [null],
    ]) {
      expect(decodeResearchCohortResponse(value)).toEqual({
        success: false,
        error: 'Invalid research cohort response from backend',
      })
    }
  })

  it('decodes both single cohort objects and one-element GET arrays', () => {
    const cohort = { groups: ['team-1'], userSelectionMode: 'groups_only', from: '2026-01-01' }
    const expected = {
      groupIds: ['team-1'],
      userSelectionMode: 'groups_only',
      from: '2026-01-01',
      to: null,
      resolvedGroupIds: [],
    }
    expect(decodeResearchCohortResponse(cohort)).toEqual({ success: true, data: expected })
    expect(decodeResearchCohortResponse([cohort])).toEqual({ success: true, data: expected })
    expect(decodeResearchCohortResponse({ dateRange: { from: null, to: null } })).toEqual({
      success: true,
      data: { groupIds: [], userSelectionMode: 'all', from: null, to: null, resolvedGroupIds: [] },
    })
  })

  it('preserves real empty history and dynamic columns but rejects corrupt rows or totals', () => {
    expect(decodeResearchHistoryResponse([])).toEqual({
      success: true,
      data: { items: [], columns: [], total: 0 },
    })
    const valid = decodeResearchHistoryResponse({ rows: [{ id: 'row-1', stressScore: 3 }], total: '1' })
    expect(valid).toMatchObject({
      success: true,
      data: { total: 1, columns: ['stressScore'], items: [{ id: 'row-1' }] },
    })
    for (const value of [{}, { items: null }, { items: [null] }, { rows: [{}], total: 1 }]) {
      expect(decodeResearchHistoryResponse(value)).toEqual({
        success: false,
        error: 'Invalid research history dataset response from backend',
      })
    }
    for (const total of ['not-a-number', '0x10', 0]) {
      expect(decodeResearchHistoryResponse({ items: [{ id: 'row-1' }], total })).toEqual({
        success: false,
        error: 'Invalid research history dataset response from backend',
      })
    }
    expect(decodeResearchHistoryResponse({ items: [{ id: 'row-1' }], total: 20 })).toMatchObject({
      success: true,
      data: { total: 20 },
    })
    expect(decodeResearchHistoryResponse({ items: [], total: 20 })).toMatchObject({
      success: true,
      data: { items: [], total: 20 },
    })
  })

  it('never invents a successful pending export from empty or malformed JSON', () => {
    const decode = createResearchExportDecoder('project-1', exportRequest)
    for (const value of [
      null,
      {},
      { status: 1 },
      { status: 'finished', content: 'x' },
      { status: 'ready' },
      { status: 'ready', content: '' },
      { status: 'ready', payload: '  ' },
      { status: 'pending_review', format: 42 },
    ]) {
      expect(decode(value)).toEqual({
        success: false,
        error: 'Invalid research export response from backend',
      })
    }

    expect(decode({ status: 'pending_review' })).toMatchObject({
      success: true,
      data: { status: 'pending_review', format: 'csv' },
    })
    expect(decode({ status: 'ready', format: 'csv', content: 'subjectId,stressScore' })).toMatchObject({
      success: true,
      data: { status: 'ready', format: 'csv', content: 'subjectId,stressScore' },
    })
    expect(decode({ status: 'ready', format: 'json', data: [] })).toMatchObject({
      success: true,
      data: { status: 'ready', format: 'json', content: '[]' },
    })
    expect(decode({ status: 'ready', format: 'json', data: false })).toMatchObject({
      success: true,
      data: { status: 'ready', format: 'json', content: 'false' },
    })
  })

  it('validates ML inspection without converting malformed payloads into default inspection data', () => {
    const decode = createResearchInspectionDecoder({ target: 'cohort' })
    expect(decode(null)).toEqual({ success: true, data: null })
    expect(decode({ governance: { review: { status: 'approved' } } })).toMatchObject({
      success: true,
      data: { target: 'cohort', governanceMetadata: { 'review.status': 'approved' } },
    })
    for (const value of [
      undefined,
      {},
      [],
      { target: null },
      { modelVersion: 42 },
      { governance: [] },
      { governance: {} },
    ]) {
      expect(decode(value)).toEqual({
        success: false,
        error: 'Invalid research ML inspection response from backend',
      })
    }
  })
})
