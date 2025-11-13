import { useTranslations } from 'next-intl'

import { Calendar } from '@/components/Calendar'
import { ThoughtsFormWrapper } from '@/components/MyThoughts/Diary/ThoughtsFormWrapper'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { PageTitle } from '@/components/ui/PageTitle'

export default function MyThoughtsPage() {
  const t = useTranslations('MyThougtsPage')
  const count = 0
  return (
    <div className="flex flex-col gap-8">
      <Breadcrumbs currentPage={t('title')} breadcrumbList={[{ title: t('ThoughtsList.title'), href: '/my-notes' }]} />
      <PageTitle title={t('title')} subtitle={t('subtitle')} />
      <div className="grid grid-cols-1 gap-6 laptop:grid-cols-2">
        <ThoughtsFormWrapper />
        <Calendar
          selectedDays={[new Date()]}
          title={t('CalendarThoughtsNotes.title')}
          subtitle={
            <p className="text-sm text-textcolor-secondary">
              <span className="mr-1 text-xl font-semibold text-textcolor-primary">{count}</span>
              {t('CalendarThoughtsNotes.subtitle')}
            </p>
          }
          activeLabel="дні з записами"
          inactiveLabel="дні без записів"
        />
      </div>
    </div>
  )
}
