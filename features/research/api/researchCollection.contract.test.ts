import {
  decodeResearchCollection,
  decodeResearchWorkspaceProjects,
  hasResearchEntityId,
} from './researchCollection.contract'

describe('Research API list contracts', () => {
  it('accepts real empty lists and the supported response aliases', () => {
    expect(decodeResearchCollection([], ['items', 'projects', 'data'])).toEqual([])
    expect(decodeResearchCollection({ items: [] }, ['items', 'projects', 'data'])).toEqual([])
    expect(decodeResearchCollection({ projects: [{ id: 'project-1' }] }, ['items', 'projects', 'data'])).toEqual([
      { id: 'project-1' },
    ])
  })

  it('rejects absent, malformed or partially invalid collections', () => {
    const keys = ['items', 'projects', 'data']
    const values = [null, {}, { items: null }, { items: 'invalid' }, { items: [null] }, { items: [1] }]

    for (const value of values) {
      expect(decodeResearchCollection(value, keys)).toBeNull()
    }
    expect(decodeResearchCollection({ items: null, data: [] }, keys)).toBeNull()
  })

  it('accepts workspace-only entitlement metadata without inventing projects', () => {
    expect(decodeResearchWorkspaceProjects({ capabilities: ['scientist'], canCreateProject: false })).toEqual([])
    expect(decodeResearchWorkspaceProjects({ items: [] })).toEqual([])
    expect(decodeResearchWorkspaceProjects({ items: null, capabilities: ['scientist'] })).toBeNull()
    expect(decodeResearchWorkspaceProjects({ capabilities: 'scientist' })).toBeNull()
    expect(decodeResearchWorkspaceProjects({})).toBeNull()
  })

  it('recognizes stable entity identities without generating random ids', () => {
    expect(hasResearchEntityId({ id: 'project-1' })).toBe(true)
    expect(hasResearchEntityId({ _id: 'project-2' })).toBe(true)
    expect(hasResearchEntityId({ id: '' })).toBe(false)
    expect(hasResearchEntityId({ title: 'Unnamed' })).toBe(false)
  })
})
