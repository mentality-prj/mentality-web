import {
  mapAnalyticsToTeamDynamicsVM,
  mapDecisionSupportReportToVM,
  mapDecisionSupportRiskEventToVM,
  mapMlInspectionToVM,
  mapMoodStatisticsToPersonalRiskOverview,
} from '@/helpers/reportingMappers'
import { AnalyticsResponse } from '@/types/company'
import { DecisionSupportReport, DecisionSupportRiskEvent } from '@/types/decisionSupport'
import { MoodStatistics } from '@/types/userStatistics'

describe('reportingMappers', () => {
  it('maps risk events into frontend risk VMs', () => {
    const event: DecisionSupportRiskEvent = {
      id: 'evt-1',
      title: 'Stress signal',
      status: 'active',
      severity: 'high',
      priority: 'high',
      confidence: 0.82,
      explanationShort: 'Стрес різко зріс за короткий період.',
      occurrenceCount: 3,
      lastSeenAt: '2026-05-18T10:00:00.000Z',
      estimatedImpactEur: 4200,
    }

    const vm = mapDecisionSupportRiskEventToVM(event, 'uk')

    expect(vm.summary).toBe('Стрес різко зріс за короткий період.')
    expect(vm.confidence.level).toBe('high')
    expect(vm.recommendedActions).toContain('Зменшити навантаження')
  })

  it('maps report overview and marks hidden fields', () => {
    const report: DecisionSupportReport = {
      executiveSummary: {
        overallStatus: 'high',
        headline: 'Команда потребує швидкого втручання.',
        confidence: 0.74,
        risks: ['Високий темп виснаження'],
        recommendations: ['Переглянути навантаження'],
      },
      actions: [
        {
          id: 'act-1',
          eventId: 'evt-1',
          riskEventId: 'evt-1',
          priority: 'high',
          severity: 'high',
          confidence: 0.7,
          title: 'Перезапустити weekly sync',
          description: 'Посилити короткий цикл командної синхронізації.',
          target: 'team',
          targetId: 'team-1',
          expectedImpact: { stressReduction: 0.3, retentionImpact: 0.2 },
        },
      ],
      teamRanking: [{ groupId: 'team-1', groupName: 'Support', riskScore: 0.61, rank: 1 }],
      groupBurnouts: [{ groupId: 'team-1', groupName: 'Support', burnoutRisk: 0.58 }],
      companyImpact: {
        totalEstimatedRiskEur: 10000,
        estimatedAttritionCostEur: 6000,
        estimatedProductivityLossEur: 4000,
      },
      groupImpacts: [],
      changeTracking: { delta: 1 },
      analyticsGuard: {
        reasonCodes: ['company_privacy_masked'],
        interpretationGuidance: 'Частина групових деталей прихована policy rules.',
      },
    }

    const vm = mapDecisionSupportReportToVM(report, 'uk')

    expect(vm.hiddenFieldKeys).toEqual(['changeTracking'])
    expect(vm.teamRanking[0].visibilityRules).toContain('aggregate-only')
    expect(vm.confidenceStrip.length).toBeGreaterThan(0)
  })

  it('derives a personal risk overview from mood statistics', () => {
    const mood: MoodStatistics = {
      totalRecords: 24,
      currentStreak: 4,
      longestStreak: 9,
      allTime: { mood: 3.9, stress: 2.2, energy: 3.8, focus: 3.7 },
      last7d: { mood: 2.8, stress: 3.7, energy: 2.9, focus: 3.0 },
      last30d: { mood: 3.4, stress: 2.8, energy: 3.4, focus: 3.5 },
      trend30d: [
        { date: '2026-04-21', mood: 3.6, stress: 2.6, energy: 3.5, focus: 3.5 },
        { date: '2026-05-01', mood: 3.1, stress: 3.0, energy: 3.2, focus: 3.2 },
        { date: '2026-05-18', mood: 2.8, stress: 3.7, energy: 2.9, focus: 3.0 },
      ],
      topTags: [
        { tag: 'sleep', count: 6 },
        { tag: 'workload', count: 5 },
      ],
      weekdayAverages: [],
    }

    const vm = mapMoodStatisticsToPersonalRiskOverview(mood, null, 'uk')

    expect(vm.topInsights.length).toBeGreaterThan(0)
    expect(vm.whySeeingThis.recentChanges.length).toBeGreaterThan(0)
    expect(vm.confidence.level).not.toBe('unknown')
    expect(vm.topInsights[0].title).not.toBe(vm.topInsights[0].text)
    expect(vm.whySeeingThis.explanationText).not.toBe(vm.whySeeingThis.recentChanges[0])
  })

  it('maps analytics into aggregate-only team dynamics', () => {
    const analytics: AnalyticsResponse = {
      companyId: 'co-1',
      from: '2026-03-01',
      to: '2026-05-18',
      privacy: { isMasked: false, maskReasons: [] },
      totalEmployees: 20,
      activeEmployees: 18,
      totalCheckins: 90,
      avgMood: 3.4,
      avgStress: 2.9,
      avgEnergy: 3.2,
      avgFocus: 3.1,
      riskDistribution: { low: 9, medium: 7, high: 4 },
      groups: [
        {
          groupId: 'team-1',
          groupName: 'Support',
          groupType: 'team',
          totalEmployees: 10,
          activeEmployees: 9,
          totalCheckins: 42,
          avgMood: 3.1,
          avgStress: 3.1,
          avgEnergy: 3.0,
          avgFocus: 3.0,
          riskDistribution: { low: 3, medium: 4, high: 3 },
        },
        {
          groupId: 'team-2',
          groupName: 'Product',
          groupType: 'team',
          totalEmployees: 10,
          activeEmployees: 9,
          totalCheckins: 48,
          avgMood: 3.7,
          avgStress: 2.6,
          avgEnergy: 3.4,
          avgFocus: 3.2,
          riskDistribution: { low: 6, medium: 3, high: 1 },
        },
      ],
      trend: [
        { period: '2026-W16', avgMood: 3.7, avgStress: 2.5, avgEnergy: 3.5, avgFocus: 3.3, checkins: 28 },
        { period: '2026-W20', avgMood: 3.1, avgStress: 3.2, avgEnergy: 3.0, avgFocus: 3.0, checkins: 32 },
      ],
    }

    const vm = mapAnalyticsToTeamDynamicsVM(analytics, 'uk')

    expect(vm.visibilityRules).toContain('aggregate-only')
    expect(vm.heatmap).toHaveLength(2)
    expect(vm.confidence.level).not.toBe('unknown')
  })

  it('builds diagnostics snapshot only from policy metrics returned by the API', () => {
    const vm = mapMlInspectionToVM(
      {
        totalRiskEvents: 12,
        activeCount: 4,
        resolvedCount: 6,
        escalatingCount: 2,
        suppressedCount: null,
        averageConfidence: 0.78,
      },
      [],
      'company',
      'co-1',
      'uk'
    )

    expect(vm.diagnostics).toEqual(
      expect.arrayContaining([
        { label: 'Усього подій', value: '12' },
        { label: 'Активний', value: '4' },
        { label: 'Вирішений', value: '6' },
        { label: 'Ескалює', value: '2' },
        { label: 'Довіра до моделі', value: 'Висока' },
      ])
    )
  })

  it('does not fabricate diagnostics fields when policy metrics are unavailable', () => {
    const vm = mapMlInspectionToVM(null, [], 'team', 'team-1', 'uk')

    expect(vm.diagnostics).toEqual([])
  })
})
