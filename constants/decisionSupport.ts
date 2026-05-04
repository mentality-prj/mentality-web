import { RiskEventActionType } from '@/types/decisionSupport'

export const DECISION_SUPPORT_ACTION_OPTIONS: ReadonlyArray<{ type: RiskEventActionType; i18nKey: string }> = [
  { type: 'one_on_one_meeting', i18nKey: 'actionMenu.options.oneOnOneMeeting' },
  { type: 'reduce_workload', i18nKey: 'actionMenu.options.reduceWorkload' },
  { type: 'team_sync', i18nKey: 'actionMenu.options.teamSync' },
]

export const DECISION_SUPPORT_SEVERITY_RANK: Record<string, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
}
