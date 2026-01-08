import { useTranslations } from 'next-intl'

import { Calendar } from '@/components/Calendar'
import { ThoughtsFormWrapper } from '@/components/MyThoughts/Diary/ThoughtsFormWrapper'
import { UserNotesWrapper } from '@/components/MyThoughts/NotesOfUser/UserNotesWrapper'
import { Breadcrumbs } from '@/ds/components/Breadcrumbs'
import { PageTitle } from '@/ds/components/PageTitle'

export default function MyThoughtsPage() {
  const t = useTranslations()
  const count = 0
  return (
    <div className="flex flex-col gap-8">
      <Breadcrumbs
        currentPage={t('pages.MyThoughts.title')}
        breadcrumbList={[
          { title: t('common.Breadcrumbs.breadcrumbsList', { title: 'myThoughts' }), href: '/my-notes' },
        ]}
      />
      <PageTitle title={t('pages.MyThoughts.title')} subtitle={t('pages.MyThoughts.subtitle')} />
      <div className="grid grid-cols-1 gap-default laptop:grid-cols-2">
        <ThoughtsFormWrapper />
        <Calendar
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
        />
      </div>
      <UserNotesWrapper />
    </div>
  )
}
