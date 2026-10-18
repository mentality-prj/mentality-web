import { CircleCheck, ArrowUpRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { Routes } from '@/constants/routes'
import { SectionCard } from '@/ds/components/SectionCard'
import { Link } from '@/i18n/navigation'

export type RoutineStatus = 'done' | 'available' | 'unknown'

type Props = {
  moodStatus: RoutineStatus
  diaryStatus: RoutineStatus
}

/**
 * A choice of three small actions, not a daily obligation or a streak.
 * The diary status is derived from a metadata-only, user-scoped endpoint;
 * this card never loads or displays journal content.
 */
export async function DailyRoutineCard({ moodStatus, diaryStatus }: Props) {
  const t = await getTranslations('components.DailyCard.routine')
  const steps = [
    {
      key: 'mood',
      title: t('moodTitle'),
      description: t('moodDescription'),
      href: Routes.MOODTRACKER,
      status: moodStatus,
    },
    {
      key: 'diary',
      title: t('diaryTitle'),
      description: t('diaryDescription'),
      href: Routes.DIARY,
      status: diaryStatus,
    },
    {
      key: 'support',
      title: t('supportTitle'),
      description: t('supportDescription'),
      href: `${Routes.GUIDE}/breathing`,
      status: 'optional' as const,
    },
  ]

  return (
    <section aria-labelledby="daily-routine-heading">
      <SectionCard>
        <div className="flex flex-col gap-md">
          <div>
            <h2 id="daily-routine-heading" className="text-lg font-semibold">
              {t('title')}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-textcolor-secondary">
              {t('description')}
            </p>
          </div>

          <ol className="flex flex-col gap-sm">
            {steps.map(({ key, title, description, href, status }) => (
              <li key={key}>
                <Link
                  href={href}
                  className="flex min-h-16 items-center justify-between gap-md rounded-xl border border-current/10 p-3 transition-colors hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <div className="min-w-0 flex-1">
                    <span className="font-medium">{title}</span>
                    <p className="mt-1 text-sm text-textcolor-secondary">{description}</p>
                    <span className="mt-1 inline-flex items-center gap-xs text-xs text-textcolor-secondary">
                      {status === 'done' && <CircleCheck size={15} aria-hidden="true" className="text-primary" />}
                      {status === 'done'
                        ? t('done')
                        : status === 'unknown'
                          ? t('unknown')
                          : t('optional')}
                    </span>
                  </div>
                  <ArrowUpRight size={18} aria-hidden="true" className="shrink-0 text-primary" />
                </Link>
              </li>
            ))}
          </ol>

          <Link
            href={Routes.MYPROGRESS}
            className="w-fit text-sm font-medium text-primary underline underline-offset-4"
          >
            {t('progressAction')}
          </Link>
        </div>
      </SectionCard>
    </section>
  )
}
