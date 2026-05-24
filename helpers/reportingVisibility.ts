import { PresentationFieldPolicy, VisibilityContext, VisibilityRule } from '@/types/reporting'

export function canAccessVisibilityRule(rule: VisibilityRule, context: VisibilityContext): boolean {
  switch (rule) {
    case 'always':
      return true
    case 'admin-only':
      return context.viewerRole === 'admin'
    case 'diagnostics-only':
      return context.viewerRole === 'admin' && context.mode === 'diagnostics'
    case 'aggregate-only':
      return Boolean(context.aggregateOnly)
    case 'experimental-hidden':
      return Boolean(context.experimentalFlags?.length)
    default:
      return false
  }
}

export function isRenderableField(policy: PresentationFieldPolicy, context: VisibilityContext): boolean {
  return canAccessVisibilityRule(policy.visibility, context)
}

export function getRenderableFields(
  policies: readonly PresentationFieldPolicy[],
  context: VisibilityContext
): string[] {
  return policies.filter((policy) => isRenderableField(policy, context)).map((policy) => policy.field)
}

export function isDiagnosticsMode(context: VisibilityContext): boolean {
  return context.viewerRole === 'admin' && context.mode === 'diagnostics'
}
