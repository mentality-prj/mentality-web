import { useTranslations } from 'next-intl'

import { ChatWithAI } from '@/components/Home/ChatWithAI'
import { ThoughtsRecording } from '@/components/MyThoughts/ThoughtsRecording'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { PageTitle } from '@/components/ui/PageTitle'
import { SectionCard } from '@/components/ui/SectionCard'

export default function MyThoughtsPage() {
  const t = useTranslations('MyThougtsPage')
  return (
    <div className="flex flex-col gap-8">
      <Breadcrumbs currentPage={t('title')} breadcrumbList={[{ title: t('ThoughtsList.title'), href: '/my-notes' }]} />
      <PageTitle title={t('title')} subtitle={t('subtitle')} />
      <div className="grid grid-cols-1 gap-6 laptop:grid-cols-2">
        <ThoughtsRecording className="h-full" />

        <ChatWithAI />
      </div>
      <SectionCard title={t('ThoughtsList.title')} subtitle={t('ThoughtsList.noThoughts')} />
    </div>
  )
}
