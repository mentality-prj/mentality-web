import { Activity, BrainCircuit } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { HoverCard } from '@/components/shared/Cards/HoverCard/HoverCard'
import { Routes } from '@/constants/routes'

const tests = [
  {
    key: 'mental-check',
    href: Routes.MENTAL_CHECK,
    icon: BrainCircuit,
    duration: 3,
    questions: 9,
  },
  {
    key: 'anxiety-check',
    href: Routes.ANXIETY_CHECK,
    icon: Activity,
    duration: 2,
    questions: 7,
  },
] as const

export default async function PsychologicalTestsPage() {
  const t = await getTranslations('pages.PsychologicalTests')

  return (
    <div className="card-container">
      {tests.map(({ key, href, icon: Icon, duration, questions }) => (
        <HoverCard
          key={key}
          href={href}
          icon={<Icon size={64} className="opacity-20" />}
          title={t(`${key}.title` as Parameters<typeof t>[0])}
          description={
            <>
              {t('duration', { minutes: duration })} · {questions} {t('questionsLabel')}
            </>
          }
        />
      ))}
    </div>
  )
}
