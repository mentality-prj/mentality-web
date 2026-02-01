'use server'
import { FilePenLine } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import { getLastMoodRecords } from '@/requests/moodRecord'

import { Days } from './Days'
import { SummaryCard } from './SummaryCard'

export const MoodRecording = async () => {
  const t = await getTranslations('components.MoodRecording')
  const d = await getTranslations('components.Days')

  const session = await auth()
  const res = await getLastMoodRecords(session, { limit: 3, active: true })
  const count = res && 'data' in res && res.data ? res.data.length : 0

  const weekDays = d.raw('days') as string[]

  return (
    <SummaryCard title={t('title')} icon={<FilePenLine className="opacity-50" color="white" size="128" />}>
      <div className="flex flex-col">
        <div className="mb-5">
          <span className="text-xl/[24px] font-semibold">{count}</span> {t('content')}
        </div>
        <Days weekDays={weekDays} />
      </div>
    </SummaryCard>
  )
}
