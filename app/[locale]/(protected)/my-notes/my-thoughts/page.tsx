import { useTranslations } from 'next-intl'

import { CalendarThoughts } from '@/components/MyThoughts/CalendarThoughtsNotes/CalendarThoughtsNotes'
import { ThoughtsFormWrapper } from '@/components/MyThoughts/Diary/ThoughtsFormWrapper'
import { UserNotes } from '@/components/MyThoughts/NotesOfUser/UserNotes'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { PageTitle } from '@/components/ui/PageTitle'

export default function MyThoughtsPage() {
  const t = useTranslations('MyThougtsPage')
  return (
    <div className="flex flex-col gap-8">
      <Breadcrumbs currentPage={t('title')} breadcrumbList={[{ title: t('ThoughtsList.title'), href: '/my-notes' }]} />
      <PageTitle title={t('title')} subtitle={t('subtitle')} />
      <div className="grid grid-cols-1 gap-6 laptop:grid-cols-2">
        <ThoughtsFormWrapper />
        <CalendarThoughts />
      </div>
      <UserNotes />
    </div>
  )
}
