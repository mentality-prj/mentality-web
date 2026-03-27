'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { GroupSelector } from '@/components/features/Company/GroupSelector'
import { useGroups } from '@/hooks/useGroups'
import { APIUrl } from '@/requests/config'
import { performAuthRequest } from '@/requests/genericFetch'
import { CustomSession } from '@/types/auth'
import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'

type AnalyticsBucket = {
  label: string
  value: number
}

type DateRangeError = string | null

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

function oneYearAgoStr(): string {
  return new Date(Date.now() - ONE_YEAR_MS).toISOString().slice(0, 10)
}

export function AnalyticsView() {
  const { data } = useSession()
  const { items: groups } = useGroups(true)

  const [groupIds, setGroupIds] = useState<string[]>([])
  const [from, setFrom] = useState(oneYearAgoStr())
  const [to, setTo] = useState(todayStr())
  const [chartData, setChartData] = useState<AnalyticsBucket[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dateError, setDateError] = useState<DateRangeError>(null)

  function validateDates(): boolean {
    const fromDate = new Date(from)
    const toDate = new Date(to)
    if (toDate <= fromDate) {
      setDateError('End date must be after start date.')
      return false
    }
    if (toDate.getTime() - fromDate.getTime() > ONE_YEAR_MS) {
      setDateError('Date range must not exceed 1 year.')
      return false
    }
    setDateError(null)
    return true
  }

  const fetchAnalytics = useCallback(async () => {
    if (!validateDates()) return
    setLoading(true)
    setError(null)
    const session = data as CustomSession
    const params = new URLSearchParams({ from, to })
    if (groupIds.length) params.set('groupIds', groupIds.join(','))
    const res = await performAuthRequest<AnalyticsBucket[]>(session, `${APIUrl}/analytics/mood?${params}`)
    if ('error' in res) {
      setError(res.error)
    } else {
      setChartData(Array.isArray(res.data) ? res.data : [])
    }
    setLoading(false)
  }, [data, from, to, groupIds]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchAnalytics()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="analytics-from">From</Label>
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
          <Label htmlFor="analytics-to">To</Label>
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

      <div className="flex flex-col gap-1.5">
        <Label>Filter by Group</Label>
        <GroupSelector groups={groups} selected={groupIds} onChange={setGroupIds} />
      </div>

      <Button onClick={fetchAnalytics} disabled={loading} className="self-start">
        {loading ? 'Loading…' : 'Apply Filters'}
      </Button>

      {error && <p className="text-destructive text-sm">{error}</p>}

      {!loading && chartData.length === 0 && !error && (
        <p className="text-sm text-textcolor-secondary">No data for the selected period and groups.</p>
      )}

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
