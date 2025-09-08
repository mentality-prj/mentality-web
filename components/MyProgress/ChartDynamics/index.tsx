'use client'

import { useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/ds/shadcn/chart'
import { Switch } from '@/ds/shadcn/switch'
import { Tabs, TabsList, TabsTrigger } from '@/ds/shadcn/tabs'

const chartData = [
  { date: '2025-08-08', mood: 46, stress: 33 },
  { date: '2025-08-09', mood: 18, stress: 38 },
  { date: '2025-08-10', mood: 35, stress: 26 },
  { date: '2025-08-11', mood: 50, stress: 57 },
  { date: '2025-08-12', mood: 77, stress: 63 },
  { date: '2025-08-13', mood: 65, stress: 78 },
  { date: '2025-08-14', mood: 49, stress: 38 },
  { date: '2025-08-15', mood: 88, stress: 67 },
  { date: '2025-08-16', mood: 0, stress: 18 },
  { date: '2025-08-17', mood: 50, stress: 40 },
  { date: '2025-08-18', mood: 61, stress: 74 },
  { date: '2025-08-19', mood: 56, stress: 47 },
  { date: '2025-08-20', mood: 71, stress: 83 },
  { date: '2025-08-21', mood: 22, stress: 49 },
  { date: '2025-08-22', mood: 18, stress: 36 },
  { date: '2025-08-23', mood: 21, stress: 40 },
  { date: '2025-08-24', mood: 97, stress: 72 },
  { date: '2025-08-25', mood: 79, stress: 82 },
  { date: '2025-08-26', mood: 54, stress: 36 },
  { date: '2025-08-27', mood: 9, stress: 29 },
  { date: '2025-08-28', mood: 22, stress: 44 },
  { date: '2025-08-29', mood: 46, stress: 36 },
  { date: '2025-08-30', mood: 21, stress: 52 },
  { date: '2025-08-31', mood: 81, stress: 66 },
  { date: '2025-09-01', mood: 45, stress: 57 },
  { date: '2025-09-02', mood: 0, stress: 30 },
  { date: '2025-09-03', mood: 80, stress: 95 },
  { date: '2025-09-04', mood: 19, stress: 36 },
  { date: '2025-09-05', mood: 66, stress: 88 },
  { date: '2025-09-06', mood: 100, stress: 88 },
]

const chartConfig = {
  mood: {
    label: 'Mood',
    color: '#905FFF',
  },
  stress: {
    label: 'Stress',
    color: '#B91C1C',
  },
} satisfies ChartConfig

export function ChartDynamics() {
  const [timeRange, setTimeRange] = useState('14d')
  const [moodChart, setMoodChart] = useState(true)
  const [stressChart, setStressChart] = useState(false)

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

      <div className="relative">
        <div className="absolute h-[92%] w-full rounded-sm border border-outline-tertiary" />
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart margin={{ bottom: 56, top: 40, right: 25, left: -20 }} data={filteredData}>
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
                <linearGradient id="fillMood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-mood)" stopOpacity={1} />
                  <stop offset="95%" stopColor="var(--color-mood)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillStress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-stress)" stopOpacity={1} />
                  <stop offset="95%" stopColor="var(--color-stress)" stopOpacity={0.1} />
                </linearGradient>
              </defs>

              {moodChart && (
                <Area
                  dot={{ r: 4, fill: 'white', stroke: 'var(--color-mood)', strokeWidth: 2 }}
                  dataKey="mood"
                  type="bump"
                  fill="url(#fillMood)"
                  fillOpacity={0.4}
                  stroke="var(--color-mood)"
                />
              )}
              {stressChart && (
                <Area
                  dot={{ r: 4, fill: 'white', stroke: 'var(--color-stress)', strokeWidth: 2 }}
                  dataKey="stress"
                  type="bump"
                  fill="url(#fillStress)"
                  fillOpacity={0.4}
                  stroke="var(--color-stress)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
      <div className="flex justify-end gap-4 pt-6">
        <div className="flex items-center gap-2">
          <Switch defaultChecked={true} onCheckedChange={setMoodChart} /> Настрій
        </div>
        <div className="flex items-center gap-2">
          <Switch onCheckedChange={setStressChart} /> Стрес
        </div>
      </div>
    </div>
  )
}
