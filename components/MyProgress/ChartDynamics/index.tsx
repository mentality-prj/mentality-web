'use client'

import { useState } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/ds/shadcn/chart'
import { Tabs, TabsList, TabsTrigger } from '@/ds/shadcn/tabs'

const chartData = [
  { date: '2025-08-08', desktop: 46, mobile: 33 },
  { date: '2025-08-09', desktop: 18, mobile: 38 },
  { date: '2025-08-10', desktop: 35, mobile: 26 },
  { date: '2025-08-11', desktop: 50, mobile: 57 },
  { date: '2025-08-12', desktop: 77, mobile: 63 },
  { date: '2025-08-13', desktop: 65, mobile: 78 },
  { date: '2025-08-14', desktop: 49, mobile: 38 },
  { date: '2025-08-15', desktop: 88, mobile: 67 },
  { date: '2025-08-16', desktop: 0, mobile: 18 },
  { date: '2025-08-17', desktop: 50, mobile: 40 },
  { date: '2025-08-18', desktop: 61, mobile: 74 },
  { date: '2025-08-19', desktop: 56, mobile: 47 },
  { date: '2025-08-20', desktop: 71, mobile: 83 },
  { date: '2025-08-21', desktop: 22, mobile: 49 },
  { date: '2025-08-22', desktop: 18, mobile: 36 },
  { date: '2025-08-23', desktop: 21, mobile: 40 },
  { date: '2025-08-24', desktop: 97, mobile: 72 },
  { date: '2025-08-25', desktop: 79, mobile: 82 },
  { date: '2025-08-26', desktop: 54, mobile: 36 },
  { date: '2025-08-27', desktop: 9, mobile: 29 },
  { date: '2025-08-28', desktop: 22, mobile: 44 },
  { date: '2025-08-29', desktop: 46, mobile: 36 },
  { date: '2025-08-30', desktop: 21, mobile: 52 },
  { date: '2025-08-31', desktop: 81, mobile: 66 },
  { date: '2025-09-01', desktop: 45, mobile: 57 },
  { date: '2025-09-02', desktop: 0, mobile: 30 },
  { date: '2025-09-03', desktop: 80, mobile: 95 },
  { date: '2025-09-04', desktop: 19, mobile: 36 },
  { date: '2025-09-05', desktop: 66, mobile: 55 },
  { date: '2025-09-06', desktop: 100, mobile: 88 },
]

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: '#905FFF',
  },
  mobile: {
    label: 'Mobile',
    color: '#B91C1C',
  },
} satisfies ChartConfig

export function ChartDynamics() {
  const [timeRange, setTimeRange] = useState('14d')

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)

    let daysToSubtract = 7
    if (timeRange === '7d') {
      daysToSubtract = 7
    } else if (timeRange === '14d') {
      daysToSubtract = 14
    } else if (timeRange === '30d') {
      daysToSubtract = 30
    } else if (timeRange === '180d') {
      daysToSubtract = 180
    } else if (timeRange === '365d') {
      daysToSubtract = 365
    }
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })
  return (
    <div className="rounded-md bg-surface-white p-8">
      <div className="mb-5 flex items-center justify-between">
        <div className="text-xl/[24px] font-semibold text-textcolor-primary">Детальна динаміка</div>
        <Tabs defaultValue="14d" onValueChange={setTimeRange}>
          <TabsList className="gap-3">
            <TabsTrigger value="7d">Тиждень</TabsTrigger>
            <TabsTrigger value="14d">Два тижні</TabsTrigger>
            <TabsTrigger value="30d">Місяць</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div>
        <ChartContainer config={chartConfig}>
          <AreaChart margin={{ bottom: 56, top: 40 }} data={filteredData}>
            <rect x="0%" y="0%" width="100%" height="92%" fill="transparent" stroke="#E4E3E8" strokeWidth={1} rx={8} />
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={56}
              minTickGap={32}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { weekday: 'short' })}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickLine={false}
              axisLine={false}
              className="absolute left-40 top-56"
              tickFormatter={(value) => ((value / 100) * 4 + 1).toFixed(0)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={1} />
                <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={1} />
                <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <Area
              dot={{ r: 4, fill: 'white', stroke: 'var(--color-mobile)', strokeWidth: 2 }}
              dataKey="mobile"
              type="bump"
              fill="url(#fillMobile)"
              fillOpacity={0.4}
              stroke="var(--color-mobile)"
            />
            <Area
              dot={{ r: 4, fill: 'white', stroke: 'var(--color-desktop)', strokeWidth: 2 }}
              dataKey="desktop"
              type="bump"
              fill="url(#fillDesktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  )
}
