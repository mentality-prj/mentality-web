import { isB2CBackendResourceAllowed, isB2COnlyRelease } from './b2cReleasePolicy'

describe('B2C-only server release policy', () => {
  afterEach(() => delete process.env.DZVIN_B2C_ONLY_RELEASE)

  it('is opt-in with an exact literal', () => {
    delete process.env.DZVIN_B2C_ONLY_RELEASE
    expect(isB2COnlyRelease()).toBe(false)
    process.env.DZVIN_B2C_ONLY_RELEASE = 'TRUE'
    expect(isB2COnlyRelease()).toBe(false)
    process.env.DZVIN_B2C_ONLY_RELEASE = 'true'
    expect(isB2COnlyRelease()).toBe(true)
  })

  it.each(['admin', 'companies/abc/users', 'research/projects', 'dip-admin/organizations', 'decision-support', 'PREDICTION'])(
    'blocks privileged route %s',
    (path) => expect(isB2CBackendResourceAllowed(path)).toBe(false)
  )

  it.each(['auth/me', 'mood-record', 'mood-story/today', 'diary', 'goals', 'contact'])(
    'preserves consumer resource %s',
    (path) => expect(isB2CBackendResourceAllowed(path)).toBe(true)
  )
})
