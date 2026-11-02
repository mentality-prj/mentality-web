import { decodeResearchWorkspaceResponse } from './researchWorkspaceResponse'

describe('Research workspace response decoder', () => {
  it('accepts an empty project collection as an intentional empty workspace', () => {
    expect(decodeResearchWorkspaceResponse([])).toEqual({
      success: true,
      data: { source: null, projects: [] },
    })
  })

  it('preserves metadata-only responses for existing backend entitlements', () => {
    const payload = { capabilities: ['scientist'], canCreateProject: false }
    expect(decodeResearchWorkspaceResponse(payload)).toEqual({
      success: true,
      data: { source: payload, projects: [] },
    })
  })

  it('rejects unknown, invalid and ambiguous authorization payloads', () => {
    const invalid = [
      null,
      {},
      { items: null },
      { items: [{ id: null, _id: 'fallback' }] },
      { items: [{ id: '' }] },
      { companies: [null] },
      { capabilities: 'research_admin' },
      { capabilities: ['research_admin'], items: 'unexpected' },
    ]

    for (const value of invalid) {
      expect(decodeResearchWorkspaceResponse(value)).toEqual({
        success: false,
        error: 'Invalid research workspace response from backend',
      })
    }
  })

  it('validates project aliases before permissions are derived', () => {
    const payload = { projects: [{ id: 'project-1' }], capabilities: ['scientist'] }
    expect(decodeResearchWorkspaceResponse(payload)).toEqual({
      success: true,
      data: { source: payload, projects: [{ id: 'project-1' }] },
    })
  })
})
