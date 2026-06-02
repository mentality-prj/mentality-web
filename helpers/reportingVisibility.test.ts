import { REPORTING_PRESENTATION_POLICY } from '@/constants/reportingPresentation'
import { canAccessVisibilityRule, getRenderableFields, isRenderableField } from '@/helpers/reportingVisibility'

describe('reportingVisibility', () => {
  it('allows diagnostics-only fields only for admin diagnostics mode', () => {
    expect(canAccessVisibilityRule('diagnostics-only', { viewerRole: 'admin', mode: 'diagnostics' })).toBe(true)
    expect(canAccessVisibilityRule('diagnostics-only', { viewerRole: 'admin', mode: 'operational' })).toBe(false)
    expect(canAccessVisibilityRule('diagnostics-only', { viewerRole: 'manager', mode: 'diagnostics' })).toBe(false)
  })

  it('keeps experimental blocks hidden by default', () => {
    expect(canAccessVisibilityRule('experimental-hidden', { viewerRole: 'admin', mode: 'diagnostics' })).toBe(false)
    expect(
      canAccessVisibilityRule('experimental-hidden', {
        viewerRole: 'admin',
        mode: 'diagnostics',
        experimentalFlags: [],
      })
    ).toBe(false)
  })

  it('reveals experimental blocks when caller has experimental flags', () => {
    expect(
      canAccessVisibilityRule('experimental-hidden', {
        viewerRole: 'admin',
        mode: 'diagnostics',
        experimentalFlags: ['some-feature'],
      })
    ).toBe(true)
  })

  it('renders hidden-kind diagnostics-only fields in diagnostics mode', () => {
    const policy = { field: 'details.diagnostics', kind: 'hidden' as const, visibility: 'diagnostics-only' as const }
    expect(isRenderableField(policy, { viewerRole: 'admin', mode: 'diagnostics' })).toBe(true)
    expect(isRenderableField(policy, { viewerRole: 'admin', mode: 'operational' })).toBe(false)
  })

  it('returns aggregate-only renderable fields when aggregate context is enabled', () => {
    const fields = getRenderableFields(REPORTING_PRESENTATION_POLICY.teamDynamics, {
      viewerRole: 'manager',
      mode: 'operational',
      aggregateOnly: true,
    })

    expect(fields).toContain('aggregateTrend')
    expect(fields).toContain('heatmap')
  })
})
