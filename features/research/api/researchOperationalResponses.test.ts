import {
  createResearchExportDecoder,
  decodeResearchCohortResponse,
  decodeResearchHistoryResponse,
} from './researchOperationalResponses'

const exportRequest = { format: 'csv', requestedFields: ['stressScore'], reason: 'Approved review' }

describe('Research operational HTTP response contracts', () => {
  it('accepts absent cohorts while rejecting malformed or ambiguous success payloads', () => {
    for (const value of [null, undefined, []]) {
      expect(decodeResearchCohortResponse(value)).toEqual({ success: true, data: null })
    }

    for (const value of [{}, { groupIds: 'invalid' }, [{}, {}], [null]]) {
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
    expect(decodeResearchHistoryResponse({ items: [{ id: 'row-1' }], total: 'not-a-number' })).toEqual({
      success: false,
      error: 'Invalid research history dataset response from backend',
    })
  })

  it('never invents a successful pending export from empty or malformed JSON', () => {
    const decode = createResearchExportDecoder('project-1', exportRequest)
    for (const value of [null, {}, { status: 1 }, { status: 'ready' }, { status: 'pending_review', format: 42 }]) {
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
  })
})
