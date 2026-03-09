import { StatusType } from '@/types/status.types'

/**
 * Maps StatusType values to border styling classes.
 *
 * SEMANTICALLY CORRECT MAPPINGS:
 * - success → border-border-success (green, indicates positive outcome)
 * - warn → border-warning (amber/gold, indicates caution/warning)
 * - error → border-border-error (red, indicates failure/error)
 * - note → border-warning (amber/gold, alerts user to important information)
 *
 * SEMANTIC MISMATCH:
 * Multiple statuses (info, special, base, default, ghost, accent, dark, support, tag, tag-white, joy)
 * are mapped to border-border-success, which produces misleading visual output.
 * For example:
 * - "info" status should use a neutral or info-colored border, not success (green)
 * - "ghost" and "dark" are neutral/background statuses, not positive outcomes
 * - "joy" and other semantic statuses should have dedicated colors
 *
 * TODO: Review which border colors should be used for:
 * info, special, base, default, ghost, accent, dark, support, tag, tag-white, joy.
 * Either map each to a semantically appropriate border class, or use a neutral default.
 */
export const BORDER_BY_STATUS: Record<StatusType, string> = {
  success: 'border border-inner-white border-border-success',
  warn: 'border border-inner-white border-warning',
  error: 'border border-inner-white border-border-error',
  info: 'border border-inner-white border-border-success',
  special: 'border border-inner-white border-border-success',
  base: 'border border-inner-white border-border-success',
  default: 'border border-inner-white border-border-success',
  ghost: 'border border-inner-white border-border-success',
  accent: 'border border-inner-white border-border-success',
  dark: 'border border-inner-white border-border-success',
  note: 'border border-inner-white border-warning',
  support: 'border border-inner-white border-border-success',
  tag: 'border border-inner-white border-border-success',
  'tag-white': 'border border-inner-white border-border-success',
  joy: 'border border-inner-white border-border-success',
}
