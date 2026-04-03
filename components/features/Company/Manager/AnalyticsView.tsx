'use client'

import { useTranslations } from 'next-intl'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { GroupSelector } from '@/components/features/Company/GroupSelector'
import { todayStr } from '@/helpers/company.helpers'
import { useAnalytics } from '@/hooks/useAnalytics'
import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'

export function AnalyticsView() {
  const t = useTranslations('pages.Company.manager.analytics')
  const {
    groups,
    groupIds,
    setGroupIds,
    from,
    setFrom,
    to,
    setTo,
    chartData,
    loading,
    error,
    dateError,
    fetchAnalytics,
  } = useAnalytics()

  return (
    <div className="flex flex-col gap-6">
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

      {groups.length > 0 && (
        <Button onClick={fetchAnalytics} disabled={loading} className="self-start">
          {loading ? t('loading') : t('applyButton')}
        </Button>
      )}

      {error && <p className="text-destructive text-sm">{error}</p>}

      {!loading && chartData.length === 0 && !error && <p className="text-sm text-textcolor-secondary">{t('empty')}</p>}

      {chartData.length > 0 && (
        <div className="rounded-md border border-border p-4">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
