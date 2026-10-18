import { getTranslations } from 'next-intl/server'

import { DiaryExportButton } from '@/components/features/Diary/DiaryExportButton'
import AddNewNoteSection from '@/components/features/Diary/AddNewNoteSection/AddNewNoteSection'
import UserNotes from '@/components/features/Diary/UserNotes/UserNotes'
import { QuickSupportCard } from '@/components/features/Guide/QuickSupportCard'
import { SafetyResources } from '@/components/features/Guide/SafetyResources'
import { Routes } from '@/constants/routes'
import { PageTitle } from '@/ds/components/PageTitle'
import { Link } from '@/i18n/navigation'
import { getServerSession } from '@/lib/get-server-session'
import { getUserDiaries } from '@/requests/diary'

export default async function DiaryPage() {
  const t = await getTranslations()
  const session = await getServerSession()
  const response = await getUserDiaries(session)

  return (
    <div className="flex flex-col gap-md">
      <PageTitle title={t('pages.Diary.title')} subtitle={t('pages.Diary.subtitle')} />
      <Link href={Routes.MYDAY} className="w-fit text-sm font-medium underline underline-offset-4">
        {t('components.Diary.backToMyDay')}
      </Link>
      <SafetyResources showDiaryPrivacy />
      <div className="grid grid-cols-1 gap-default laptop:grid-cols-2">
        <AddNewNoteSection />
        <QuickSupportCard />
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
      {'error' in response ? (
        <div role="alert" className="rounded-2xl border border-gray-100 bg-white p-6 text-sm text-textcolor-secondary">
          {t('components.Diary.historyLoadError')}
        </div>
      ) : (
        <>
          <DiaryExportButton notes={response.data ?? []} />
          <UserNotes notes={response.data ?? []} />
        </>
      )}
    </div>
  )
}
