import { Activity } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { getAuthHeaders } from '@/actions/getAuthHeaders'
import { HistoryChart } from '@/components/shared/HistoryChart'
import { GAD7_MAX_SCORE, GAD7_STUB_HISTORY } from '@/constants/gad7'
import { APIUrl } from '@/requests/config'
import { Gad7HistoryEntry } from '@/types/gad7'

export default async function Gad7HistoryChart() {
  const [headers, t] = await Promise.all([getAuthHeaders(), getTranslations('pages.AnxietyCheck')])

  let history: Gad7HistoryEntry[] = []
  let isStub = false
  try {
    const res = await fetch(`${APIUrl}/gad7/history`, { headers, cache: 'no-store' })
    if (!res.ok) {
      // Treat non-OK responses as missing history
      history = GAD7_STUB_HISTORY
      isStub = true
    } else {
      const raw: Gad7HistoryEntry[] = await res.json()
      if (Array.isArray(raw) && raw.length >= 2) {
        history = raw
      } else {
        history = GAD7_STUB_HISTORY
        isStub = true
      }
    }
  } catch {
    history = GAD7_STUB_HISTORY
    isStub = true
  }

  return (
    <HistoryChart
      history={history}
      isStub={isStub}
      chartLabel="GAD-7"
      gradientId="gad7Fill"
      title={t('chart.title')}
      stubTitle={t('chart.stubNote')}
      icon={<Activity className="opacity-50" color="white" size={128} />}
      maxScore={GAD7_MAX_SCORE}
      ticks={[0, 5, 10, 15, 21]}
    />
  )
}
