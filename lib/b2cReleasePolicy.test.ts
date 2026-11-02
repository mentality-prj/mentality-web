import { isB2CBackendResourceAllowed, isB2COnlyRelease } from './b2cReleasePolicy'

describe('B2C-only server release policy', () => {
  afterEach(() => {
    delete process.env.DZVIN_B2C_ONLY_RELEASE
  })

  it('is opt-in with an exact literal', () => {
    delete process.env.DZVIN_B2C_ONLY_RELEASE
    expect(isB2COnlyRelease()).toBe(false)
    process.env.DZVIN_B2C_ONLY_RELEASE = 'TRUE'
    expect(isB2COnlyRelease()).toBe(false)
    process.env.DZVIN_B2C_ONLY_RELEASE = 'true'
    expect(isB2COnlyRelease()).toBe(true)
  })

  it('blocks privileged B2B and QDIP resource prefixes', () => {
    for (const path of [
      'admin',
      'companies/abc/users',
      'research/projects',
      'dip-admin/organizations',
      'decision-support',
      'operational/v1/reports/overview',
      'team/v1/overview',
      'admin-diagnostics/v1/ml/inspection',
      'personal/v1/overview',
      'PREDICTION',
      'mood-risk/actionable',
      'MOOD-FEED',
    ]) {
      expect(isB2CBackendResourceAllowed(path)).toBe(false)
    }
  })

  it('preserves consumer resources', () => {
    for (const path of ['auth/me', 'mood-record', 'mood-story/today', 'diary', 'goals', 'contact']) {
      expect(isB2CBackendResourceAllowed(path)).toBe(true)
    }
  })
})
