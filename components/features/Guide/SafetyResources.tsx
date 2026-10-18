import { getTranslations } from 'next-intl/server'

import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/navigation'

type Props = { showDiaryPrivacy?: boolean }

/**
 * Human-help route independent of mood scoring, diary availability and AI.
 * Never inspect journal text in order to decide whether help is accessible.
 */
export async function SafetyResources({ showDiaryPrivacy = false }: Props) {
  const t = await getTranslations('components.ExercisesForRecovery.safety')

  return (
    <aside aria-label={t('label')} className="rounded-xl border border-gray-200 bg-white p-4 text-sm">
      {showDiaryPrivacy && (
        <p className="mb-3 leading-relaxed text-textcolor-secondary">
          {t('diaryPrivacy')}{' '}
          <Link href={Routes.PRIVACY} className="font-medium text-primary underline underline-offset-4">
            {t('privacyLink')}
          </Link>
        </p>
      )}
      <details>
        <summary className="cursor-pointer font-semibold text-textcolor-primary focus-visible:outline-2 focus-visible:outline-offset-2">
          {t('emergencySummary')}
        </summary>
        <div className="mt-3 flex flex-col gap-sm text-textcolor-secondary">
          <p className="leading-relaxed">{t('emergencyIntro')}</p>
          <a
            href="tel:112"
            className="inline-flex min-h-11 w-fit items-center rounded-xl border border-current px-4 py-2 font-medium text-textcolor-primary focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {t('phoneAction')}
          </a>
          <p className="text-xs leading-relaxed">{t('phoneCoverage')}</p>
          <p className="leading-relaxed">{t('otherSupport')}</p>
          <p className="text-xs leading-relaxed">{t('limitation')}</p>
        </div>
      </details>
    </aside>
  )
}
