import { ChatWithAI } from '@/components/Home/ChatWithAI'
import { ThoughtsRecording } from '@/components/MyThoughts/ThoughtsRecording'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { PageTitle } from '@/components/ui/PageTitle'
import { SectionCard } from '@/components/ui/SectionCard'

export default function MyThoughtsPage() {
  return (
    <div className="flex flex-col gap-8">
      <Breadcrumbs currentPage="Мої думки" breadcrumbList={[{ title: 'Мої записи', href: '/my-notes' }]} />
      <PageTitle title="Мої думки" subtitle="Веди щоденник своїх думок " />
      <div className="grid grid-cols-1 gap-6 tablet:grid-cols-2">
        <ThoughtsRecording className="h-full" />

        <ChatWithAI />
      </div>
      <SectionCard title="Мої записи" subtitle="У тебе ще не має записів." />
    </div>
  )
}
