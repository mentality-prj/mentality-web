import { getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import AddNewNote from '@/components/Diary/AddNewNoteClient'
import UserNotes from '@/components/Diary/UserNotes'
import { Breadcrumbs } from '@/ds/components/Breadcrumbs'
import { PageTitle } from '@/ds/components/PageTitle'
import { getUserDiaries } from '@/requests/diary'

export default async function MyThoughtsPage() {
  const t = await getTranslations()
  const session = await auth()
  const response = await getUserDiaries(session)

  // const count = 0
  return (
    <div className="flex flex-col gap-md">
      <Breadcrumbs
        currentPage={t('pages.MyThoughts.title')}
        breadcrumbList={[
          { title: t('common.Breadcrumbs.breadcrumbsList', { title: 'myThoughts' }), href: '/my-notes' },
        ]}
      />
      <PageTitle title={t('pages.MyThoughts.title')} subtitle={t('pages.MyThoughts.subtitle')} />
      <div className="grid grid-cols-1 gap-default laptop:grid-cols-2">
        <AddNewNote />
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
