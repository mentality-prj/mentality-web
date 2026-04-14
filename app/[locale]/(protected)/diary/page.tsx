import { getTranslations } from 'next-intl/server'

import AddNewNoteSection from '@/components/features/Diary/AddNewNoteSection/AddNewNoteSection'
import UserNotes from '@/components/features/Diary/UserNotes/UserNotes'
import { PageTitle } from '@/ds/components/PageTitle'
import { getServerSession } from '@/lib/get-server-session'
import { getUserDiaries } from '@/requests/diary'

export default async function DiaryPage() {
  const t = await getTranslations()
  const session = await getServerSession()
  const response = await getUserDiaries(session)

  return (
    <div className="flex flex-col gap-md">
      <PageTitle title={t('pages.Diary.title')} subtitle={t('pages.Diary.subtitle')} />
      <div className="grid grid-cols-1 gap-default laptop:grid-cols-2">
        <AddNewNoteSection />
        {/* TODO: fix calendar */}
        {/* <Calendar
          selectedDays={[new Date()]}
          title={t('components.Calendar.title', { type: 'myThoughts' })}
          subtitle={
            <p className="text-sm text-textcolor-secondary">
              <span className="mr-1 text-xl font-semibold text-textcolor-primary">{count}</span>
              {t('components.Calendar.subtitle', { type: 'myThoughts' })}
            </p>
          }
          activeLabel={t('components.Calendar.daysWithActivity', { type: 'myThoughts' })}
          inactiveLabel={t('components.Calendar.daysWithoutActivity', { type: 'myThoughts' })}
        /> */}
      </div>
      <UserNotes notes={response.data ?? []} />
    </div>
  )
}
