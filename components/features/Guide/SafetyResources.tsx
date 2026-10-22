import { getTranslations } from 'next-intl/server'

import { Routes } from '@/constants/routes'
import { SectionCard } from '@/ds/components/SectionCard'
import { Link } from '@/i18n/navigation'
import { Button } from '@/ui/button'

type Props = { showDiaryPrivacy?: boolean }

/**
 * An unconditional human-help affordance, independent of mood, diary API
 * availability or AI. Do not inspect sensitive user input here.
 */
export async function SafetyResources({ showDiaryPrivacy = false }: Props) {
  const t = await getTranslations('components.ExercisesForRecovery.safety')

  return (
    <aside aria-label={t('label')}>
      <SectionCard className="border-outline-secondary rounded-2xl border p-4">
        <div className="flex flex-col gap-sm">
          {showDiaryPrivacy && (
            <p className="leading-relaxed text-textcolor-secondary">
              {t('diaryPrivacy')}{' '}
              <Link
                href={Routes.PRIVACY}
                className="font-medium text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {t('privacyLink')}
              </Link>
            </p>
          )}
          <h2 className="text-base font-semibold text-textcolor-primary">{t('emergencySummary')}</h2>
          <p className="text-sm leading-relaxed text-textcolor-secondary">{t('emergencyIntro')}</p>
          <div className="flex flex-wrap items-center gap-sm">
            <Button asChild variant="secondary" size="medium" className="min-h-11">
              <a href="tel:112">{t('phoneAction')}</a>
            </Button>
          </div>
          <p className="text-xs leading-relaxed text-textcolor-secondary">{t('phoneCoverage')}</p>
          <p className="text-sm leading-relaxed text-textcolor-secondary">{t('otherSupport')}</p>
          <p className="text-xs leading-relaxed text-textcolor-secondary">{t('limitation')}</p>
        </div>
      </SectionCard>
    </aside>
  )
}
