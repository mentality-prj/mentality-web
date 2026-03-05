import { Activity, BrainCircuit } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/navigation'

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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {tests.map(({ key, href, icon: Icon, duration, questions }) => (
        <Link
          key={key}
          href={href}
          className="border-outline-secondary hover:bg-background-default group flex flex-col gap-4 rounded-2xl border bg-background-soft p-6 transition-all hover:border-primary"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <Icon size={20} />
            </div>
            <h3 className="text-base font-semibold text-textcolor-primary">
              {t(`${key}.title` as Parameters<typeof t>[0])}
            </h3>
          </div>
          <p className="text-sm text-textcolor-secondary">
            {t('duration', { minutes: duration })} · {questions} {t('questionsLabel')}
          </p>
        </Link>
      ))}
    </div>
  )
}
