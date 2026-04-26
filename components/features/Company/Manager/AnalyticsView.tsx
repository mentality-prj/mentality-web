'use client'

import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, ChevronRight, FilterX, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { GroupSelector } from '@/components/features/Company/GroupSelector'
import { buildAnalyticsTrendChartData, todayStr } from '@/helpers/company.helpers'
import { useAnalytics } from '@/hooks/useAnalytics'
import { AnalyticsGroupResult, AnalyticsMaskReason, GroupEntity } from '@/types/company'
import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'

export function AnalyticsView() {
  const t = useTranslations('pages.Company.manager.analytics')
  const { groups, groupIds, setGroupIds, from, setFrom, to, setTo, analytics, loading, error, dateError } =
    useAnalytics()

  const hasData = Boolean(
    analytics && (analytics.groups.length > 0 || analytics.totalEmployees > 0 || analytics.totalCheckins > 0)
  )
  const isMasked = analytics?.privacy?.isMasked ?? false
  const maskReasons = analytics?.privacy?.maskReasons ?? []

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [riskFilter, setRiskFilter] = useState<'low' | 'medium' | 'high' | null>(null)
  const groupsTableRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isMasked) setRiskFilter(null)
  }, [isMasked])

  const toggleRiskFilter = (level: 'low' | 'medium' | 'high') => {
    setRiskFilter((prev) => (prev === level ? null : level))
    if (riskFilter !== level) {
      setTimeout(() => groupsTableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    }
  }

  const toggleExpand = (groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(groupId)) next.delete(groupId)
      else next.add(groupId)
      return next
    })
  }

  const parentMap = useMemo(() => {
    const map = new Map<string, string | null>()
    const flatten = (g: GroupEntity) => {
      map.set(g.id, g.parentGroupId)
      g.children.forEach(flatten)
    }
    groups.forEach(flatten)
    return map
  }, [groups])

  const { rootGroups, childrenMap, visibleGroups } = useMemo(() => {
    if (!analytics) return { rootGroups: [], childrenMap: new Map<string, AnalyticsGroupResult[]>(), visibleGroups: [] }
    const selectedSet = new Set(groupIds)
    const visibleGroups =
      selectedSet.size > 0 ? analytics.groups.filter((g) => selectedSet.has(g.groupId)) : analytics.groups
    const ids = new Set(visibleGroups.map((g) => g.groupId))
    const roots: AnalyticsGroupResult[] = []
    const children = new Map<string, AnalyticsGroupResult[]>()
    for (const g of visibleGroups) {
      const parentId = parentMap.get(g.groupId) ?? null
      if (parentId && ids.has(parentId)) {
        const arr = children.get(parentId) ?? []
        arr.push(g)
        children.set(parentId, arr)
      } else {
        roots.push(g)
      }
    }
    return { rootGroups: roots, childrenMap: children, visibleGroups }
  }, [analytics, parentMap, groupIds])

  const derivedStats = useMemo(() => {
    if (!analytics) return null
    if (groupIds.length === 0) {
      return {
        totalEmployees: analytics.totalEmployees,
        activeEmployees: analytics.activeEmployees,
        totalCheckins: analytics.totalCheckins,
        avgMood: analytics.avgMood,
        avgStress: analytics.avgStress,
        avgEnergy: analytics.avgEnergy,
        avgFocus: analytics.avgFocus,
        riskDistribution: analytics.riskDistribution ?? { low: 0, medium: 0, high: 0 },
      }
    }
    const totalEmployees = visibleGroups.reduce((s, g) => s + g.totalEmployees, 0)
    const activeEmployees = visibleGroups.reduce((s, g) => s + g.activeEmployees, 0)
    const totalCheckins = visibleGroups.reduce((s, g) => s + g.totalCheckins, 0)
    const wavg = (key: 'avgMood' | 'avgStress' | 'avgEnergy' | 'avgFocus') => {
      const pick = (g: AnalyticsGroupResult) => {
        switch (key) {
          case 'avgMood':
            return g.avgMood
          case 'avgStress':
            return g.avgStress
          case 'avgEnergy':
            return g.avgEnergy
          case 'avgFocus':
            return g.avgFocus
        }
      }
      return totalCheckins > 0
        ? Math.round((visibleGroups.reduce((s, g) => s + (pick(g) ?? 0) * g.totalCheckins, 0) / totalCheckins) * 10) /
            10
        : 0
    }
    return {
      totalEmployees,
      activeEmployees,
      totalCheckins,
      avgMood: wavg('avgMood'),
      avgStress: wavg('avgStress'),
      avgEnergy: wavg('avgEnergy'),
      avgFocus: wavg('avgFocus'),
      riskDistribution: {
        low: visibleGroups.reduce((s, g) => s + (g.riskDistribution?.low ?? 0), 0),
        medium: visibleGroups.reduce((s, g) => s + (g.riskDistribution?.medium ?? 0), 0),
        high: visibleGroups.reduce((s, g) => s + (g.riskDistribution?.high ?? 0), 0),
      },
    }
  }, [analytics, groupIds, visibleGroups])

  const formatMetric = (value: number | null | undefined): ReactNode => {
    if (value == null) return '—'
    return value
  }

  const getRiskValue = (group: AnalyticsGroupResult, level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return group.riskDistribution?.low ?? 0
      case 'medium':
        return group.riskDistribution?.medium ?? 0
      case 'high':
        return group.riskDistribution?.high ?? 0
    }
  }

  const getDominantRiskLevel = (group: AnalyticsGroupResult): 'low' | 'medium' | 'high' | null => {
    const low = group.riskDistribution?.low ?? 0
    const medium = group.riskDistribution?.medium ?? 0
    const high = group.riskDistribution?.high ?? 0
    const max = Math.max(low, medium, high)

    if (max <= 0) return null
    // Resolve ties deterministically by severity: high -> medium -> low.
    if (high === max) return 'high'
    if (medium === max) return 'medium'
    return 'low'
  }

  const riskFilteredGroups = useMemo(() => {
    if (!riskFilter || !analytics) return null
    return [...visibleGroups]
      .filter((g) => getDominantRiskLevel(g) === riskFilter)
      .sort((a, b) => getRiskValue(b, riskFilter) - getRiskValue(a, riskFilter))
  }, [riskFilter, visibleGroups, analytics])

  const trendChartData = useMemo(() => {
    if (!analytics) return []
    return buildAnalyticsTrendChartData(analytics.trend)
  }, [analytics])

  const periodLabelMap = useMemo(
    () => new Map(trendChartData.map((entry) => [entry.period, entry.periodLabel])),
    [trendChartData]
  )

  return (
    <div className="flex flex-col gap-sm">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="analytics-from">{t('fromLabel')}</Label>
          <Input
            id="analytics-from"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            max={to}
            className="text-sm"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="analytics-to">{t('toLabel')}</Label>
          <Input
            id="analytics-to"
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            min={from}
            max={todayStr()}
            className="text-sm"
          />
        </div>
      </div>

      {dateError && <p className="text-destructive text-sm">{dateError}</p>}

      {groups.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <Label>{t('filterByGroup')}</Label>
          <GroupSelector groups={groups} selected={groupIds} onChange={setGroupIds} />
        </div>
      )}

      <div className="flex gap-2">
        {groups.length > 0 && groupIds.length > 0 && (
          <Button type="button" variant="secondary" onClick={() => setGroupIds([])} className="self-start">
            <FilterX size={16} />
            {t('clearFilters')}
          </Button>
        )}
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      {!loading && !hasData && !error && <p className="text-sm text-textcolor-secondary">{t('empty')}</p>}

      {hasData && derivedStats && (
        <>
          {isMasked && <MaskedAnalyticsPlaceholder reasons={maskReasons} message={t('maskedNotice')} />}

          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            <SummaryCard label={t('totalEmployees')} value={derivedStats.totalEmployees} />
            <SummaryCard label={t('activeEmployees')} value={derivedStats.activeEmployees} />
            <SummaryCard label={t('totalCheckins')} value={derivedStats.totalCheckins} />
            <SummaryCard
              label={t('avgMood')}
              value={isMasked ? t('maskedValue') : formatMetric(derivedStats.avgMood)}
            />
            <SummaryCard
              label={t('avgStress')}
              value={isMasked ? t('maskedValue') : formatMetric(derivedStats.avgStress)}
            />
            <SummaryCard
              label={t('avgEnergy')}
              value={isMasked ? t('maskedValue') : formatMetric(derivedStats.avgEnergy)}
            />
            <SummaryCard
              label={t('avgFocus')}
              value={isMasked ? t('maskedValue') : formatMetric(derivedStats.avgFocus)}
            />
          </div>

          {/* Risk distribution */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">{t('riskDistribution')}</h3>
            {isMasked ? (
              <MaskedAnalyticsPlaceholder reasons={maskReasons} message={t('riskDistributionMasked')} compact />
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex gap-4">
                  <RiskBadge
                    label={t('riskLow')}
                    count={derivedStats.riskDistribution.low}
                    active={riskFilter === 'low'}
                    onClick={() => toggleRiskFilter('low')}
                    colorClass="bg-green-100 text-green-800 ring-green-400"
                  />
                  <RiskBadge
                    label={t('riskMedium')}
                    count={derivedStats.riskDistribution.medium}
                    active={riskFilter === 'medium'}
                    onClick={() => toggleRiskFilter('medium')}
                    colorClass="bg-yellow-100 text-yellow-800 ring-yellow-400"
                  />
                  <RiskBadge
                    label={t('riskHigh')}
                    count={derivedStats.riskDistribution.high}
                    active={riskFilter === 'high'}
                    onClick={() => toggleRiskFilter('high')}
                    colorClass="bg-red-100 text-red-800 ring-red-400"
                  />
                </div>
                <p className="text-xs text-textcolor-secondary">{t('riskDistributionHint')}</p>
              </div>
            )}
          </div>

          {/* Trend chart */}
          {((analytics?.trend?.length ?? 0) > 0 || isMasked) && (
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">{t('trendTitle')}</h3>
              <div className="rounded-md border border-border p-4">
                {isMasked ? (
                  <MaskedAnalyticsPlaceholder reasons={maskReasons} message={t('trendMasked')} compact />
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={trendChartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="period"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value: string) => periodLabelMap.get(value) ?? value}
                      />
                      <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
                      <Tooltip labelFormatter={(value: string) => periodLabelMap.get(value) ?? String(value)} />
                      <Line
                        type="monotone"
                        dataKey="avgMood"
                        stroke="hsl(var(--primary))"
                        name={t('avgMood')}
                        connectNulls={false}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="avgStress"
                        stroke="hsl(var(--destructive))"
                        name={t('avgStress')}
                        connectNulls={false}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="avgEnergy"
                        stroke="hsl(var(--chart-3))"
                        name={t('avgEnergy')}
                        connectNulls={false}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="avgFocus"
                        stroke="hsl(var(--chart-4))"
                        name={t('avgFocus')}
                        connectNulls={false}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          )}

          {/* Groups table */}
          {(analytics?.groups?.length ?? 0) > 0 && (
            <div ref={groupsTableRef} className="flex flex-col gap-2">
              <div className="flex items-center gap-xs">
                <h3 className="text-sm font-medium">{t('groupsTitle')}</h3>
                {!isMasked && riskFilter && (
                  <span
                    className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                      riskFilter === 'high'
                        ? 'bg-red-100 text-red-800'
                        : riskFilter === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {t(`risk${riskFilter.charAt(0).toUpperCase() + riskFilter.slice(1)}` as 'riskHigh')}
                    <button
                      type="button"
                      onClick={() => setRiskFilter(null)}
                      aria-label={t('clearRiskFilter')}
                      className="ml-1"
                    >
                      <X size={10} />
                    </button>
                  </span>
                )}
              </div>
              <div className="overflow-x-auto rounded-md border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-background-soft">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">{t('groupName')}</th>
                      <th className="px-3 py-2 text-right font-medium">{t('totalEmployees')}</th>
                      <th className="px-3 py-2 text-right font-medium">{t('totalCheckins')}</th>
                      <th className="px-3 py-2 text-right font-medium">{t('avgMood')}</th>
                      <th className="px-3 py-2 text-right font-medium">{t('avgStress')}</th>
                      <th className="px-3 py-2 text-right font-medium">{t('avgEnergy')}</th>
                      <th className="px-3 py-2 text-right font-medium">{t('avgFocus')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!isMasked && riskFilteredGroups
                      ? riskFilteredGroups.map((g) => (
                          <tr key={g.groupId} className="border-t border-border">
                            <td className="px-3 py-2">{g.groupName}</td>
                            <td className="px-3 py-2 text-right">{g.totalEmployees}</td>
                            <td className="px-3 py-2 text-right">{g.totalCheckins}</td>
                            <td className="px-3 py-2 text-right">{g.avgMood}</td>
                            <td className="px-3 py-2 text-right">{g.avgStress}</td>
                            <td className="px-3 py-2 text-right">{g.avgEnergy}</td>
                            <td className="px-3 py-2 text-right">{g.avgFocus}</td>
                          </tr>
                        ))
                      : rootGroups.map((g) => (
                          <GroupRow
                            key={g.groupId}
                            group={g}
                            childrenMap={childrenMap}
                            expandedGroups={expandedGroups}
                            toggleExpand={toggleExpand}
                            isMasked={isMasked}
                            depth={0}
                          />
                        ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function SummaryCard({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-md border border-border p-3">
      <p className="text-textcolor-tertiary text-xs">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  )
}

function RiskBadge({
  label,
  count,
  active,
  onClick,
  colorClass,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
  colorClass: string
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`rounded px-3 py-1 text-sm transition-all ${colorClass} ${
        active ? 'ring-2' : 'opacity-80 hover:opacity-100'
      }`}
    >
      {label}: {count}
    </button>
  )
}

function GroupRow({
  group,
  childrenMap,
  expandedGroups,
  toggleExpand,
  isMasked,
  depth,
}: {
  group: AnalyticsGroupResult
  childrenMap: Map<string, AnalyticsGroupResult[]>
  expandedGroups: Set<string>
  toggleExpand: (id: string) => void
  isMasked: boolean
  depth: number
}) {
  const t = useTranslations('pages.Company.manager.analytics')
  const children = childrenMap.get(group.groupId) ?? []
  const hasChildren = children.length > 0
  const isExpanded = expandedGroups.has(group.groupId)

  return (
    <>
      <tr className="border-t border-border">
        <td className="px-3 py-2">
          <div className="flex items-center" style={{ paddingLeft: depth * 20 }}>
            {hasChildren ? (
              <button
                onClick={() => toggleExpand(group.groupId)}
                className="mr-1 flex-shrink-0 text-textcolor-secondary hover:text-textcolor-primary"
                type="button"
                aria-expanded={isExpanded}
                aria-label={isExpanded ? t('collapseSubgroups') : t('expandSubgroups')}
              >
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            ) : (
              <span className="mr-1 w-[14px] flex-shrink-0" />
            )}
            {group.groupName}
          </div>
        </td>
        <td className="px-3 py-2 text-right">{group.totalEmployees}</td>
        <td className="px-3 py-2 text-right">{group.totalCheckins}</td>
        <td className="px-3 py-2 text-right">{isMasked ? t('maskedValue') : group.avgMood}</td>
        <td className="px-3 py-2 text-right">{isMasked ? t('maskedValue') : group.avgStress}</td>
        <td className="px-3 py-2 text-right">{isMasked ? t('maskedValue') : group.avgEnergy}</td>
        <td className="px-3 py-2 text-right">{isMasked ? t('maskedValue') : group.avgFocus}</td>
      </tr>
      {isExpanded &&
        children.map((child) => (
          <GroupRow
            key={child.groupId}
            group={child}
            childrenMap={childrenMap}
            expandedGroups={expandedGroups}
            toggleExpand={toggleExpand}
            isMasked={isMasked}
            depth={depth + 1}
          />
        ))}
    </>
  )
}

function MaskedAnalyticsPlaceholder({
  reasons,
  message,
  compact = false,
}: {
  reasons: AnalyticsMaskReason[]
  message: string
  compact?: boolean
}) {
  const t = useTranslations('pages.Company.manager.analytics')

  return (
    <div
      className={`rounded-md border border-dashed border-amber-300 bg-amber-50 text-amber-950 ${
        compact ? 'p-3' : 'p-4'
      }`}
    >
      <p className="text-sm font-medium">{message}</p>
      {reasons.length > 0 && (
        <ul className="mt-2 list-disc pl-5 text-sm">
          {reasons.map((reason) => (
            <li key={reason}>{t(`maskReasons.${reason}` as const)}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
