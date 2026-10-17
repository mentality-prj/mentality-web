/**
 * An explicit, deployment-scoped B2C-only launch switch.
 * Never infer a product security boundary from hidden navigation items.
 */
export function isB2COnlyRelease(): boolean {
  return process.env.DZVIN_B2C_ONLY_RELEASE === 'true'
}

const BLOCKED_B2B_RESOURCES = new Set([
  'admin',
  'company',
  'companies',
  'groups',
  'research',
  'research-projects',
  'research-project',
  'dip',
  'dip-admin',
  'decision-support',
  'operational',
  'team',
  'admin-diagnostics',
  'personal',
  'prediction',
  'cohorts',
])

/**
 * Defense in depth at the Next.js BFF. Authorization/ownership is still
 * enforced by NestJS, and independently guarded server actions must check
 * the same release switch.
 */
export function isB2CBackendResourceAllowed(validatedPath: string): boolean {
  const first = validatedPath.split(/[/?]/, 1)[0]?.toLowerCase()
  return Boolean(first) && !BLOCKED_B2B_RESOURCES.has(first)
}
