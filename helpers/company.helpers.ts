import { ONE_YEAR_MS } from '@/constants/company'
import { AnalyticsTrendChartPoint, AnalyticsTrendPoint, GroupEntity } from '@/types/company'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DAY_MS = 24 * 60 * 60 * 1000

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim())
}

export function classifyInviteError(error: string, t: (key: string) => string): string {
  const lower = error.toLowerCase()
  if (error.includes('409') || lower.includes('duplicate')) return t('errorDuplicate')
  if (lower.includes('already in company')) return t('errorAlreadyMember')
  return error
}

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

export function oneYearAgoStr(): string {
  return new Date(Date.now() - ONE_YEAR_MS).toISOString().slice(0, 10)
}

function parseAnalyticsPeriod(period: string): { start: Date; end: Date } | null {
  const [from, to] = period.split('/')
  if (!from || !to) return null

  const start = new Date(`${from}T00:00:00.000Z`)
  const end = new Date(`${to}T00:00:00.000Z`)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end.getTime() < start.getTime()) {
    return null
  }

  return { start, end }
}

function formatAnalyticsPeriodPart(date: Date): string {
  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  return `${day}.${month}`
}

function formatAnalyticsPeriodPartWithYear(date: Date): string {
  return `${formatAnalyticsPeriodPart(date)}.${date.getUTCFullYear()}`
}

function formatAnalyticsPeriodToken(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function createTrendChartPoint(point: AnalyticsTrendPoint): AnalyticsTrendChartPoint {
  return {
    ...point,
    periodLabel: formatAnalyticsPeriodLabel(point.period),
    isGap: false,
  }
}

function createGapChartPoint(startMs: number, endMs: number): AnalyticsTrendChartPoint {
  const start = new Date(startMs)
  const end = new Date(endMs)
  const period = `${formatAnalyticsPeriodToken(start)}/${formatAnalyticsPeriodToken(end)}`

  return {
    period,
    periodLabel: formatAnalyticsPeriodLabel(period),
    avgMood: null,
    avgStress: null,
    avgEnergy: null,
    avgFocus: null,
    checkins: null,
    isGap: true,
  }
}

export function formatAnalyticsPeriodLabel(period: string): string {
  const range = parseAnalyticsPeriod(period)
  if (!range) return period

  return `${formatAnalyticsPeriodPartWithYear(range.start)} – ${formatAnalyticsPeriodPartWithYear(range.end)}`
}

export function buildAnalyticsTrendChartData(trend: AnalyticsTrendPoint[]): AnalyticsTrendChartPoint[] {
  if (trend.length === 0) return []

  const chartData: AnalyticsTrendChartPoint[] = []

  trend.forEach((point, index) => {
    chartData.push(createTrendChartPoint(point))

    const currentRange = parseAnalyticsPeriod(point.period)
    const nextPoint = trend[index + 1]
    const nextRange = nextPoint ? parseAnalyticsPeriod(nextPoint.period) : null

    if (!currentRange || !nextRange) return

    const periodLengthDays = Math.max(
      1,
      Math.round((currentRange.end.getTime() - currentRange.start.getTime()) / DAY_MS) + 1
    )
    const lastGapDayMs = nextRange.start.getTime() - DAY_MS
    let gapStartMs = currentRange.end.getTime() + DAY_MS

    while (gapStartMs <= lastGapDayMs) {
      const gapEndMs = Math.min(gapStartMs + (periodLengthDays - 1) * DAY_MS, lastGapDayMs)
      chartData.push(createGapChartPoint(gapStartMs, gapEndMs))
      gapStartMs = gapEndMs + DAY_MS
    }
  })

  return chartData
}

/**
 * Collects the IDs of all descendants of a group node (i.e. children, grandchildren, etc.).
 */
export function getDescendantIds(group: GroupEntity): Set<string> {
  const ids = new Set<string>()
  function collect(node: GroupEntity) {
    node.children.forEach((c) => {
      ids.add(c.id)
      collect(c)
    })
  }
  collect(group)
  return ids
}

/**
 * Precomputes which tree nodes should be shown during search: a node is visible
 * if it matches the query OR any of its descendants match.
 */
export function computeVisibleSet(groups: GroupEntity[], matchSet: Set<string>): Set<string> {
  const visible = new Set<string>()
  function walk(group: GroupEntity): boolean {
    const selfMatch = matchSet.has(group.id)
    const childMatch = group.children.some(walk)
    if (selfMatch || childMatch) visible.add(group.id)
    return selfMatch || childMatch
  }
  groups.forEach(walk)
  return visible
}
