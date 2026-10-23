import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'

import { Routes } from '@/constants/routes'
import { SectionCard } from '@/ds/components/SectionCard'
import { Link } from '@/i18n/navigation'
import { Button } from '@/ui/button'

import { HelpfulReturnPrompt } from './HelpfulReturnPrompt'

/**
 * A small grounding prompt is always available without waiting for the
 * exercises API or requiring a mood check-in. The links reuse the Guide.
 */
export async function QuickSupportCard({ showHelpfulReturn = false }: { showHelpfulReturn?: boolean } = {}) {
  const t = await getTranslations('components.ExercisesForRecovery.quickSupport')
  return (
    <section aria-labelledby="quick-support-heading">
      <SectionCard>
        <div className="flex flex-col gap-sm">
          <div>
            <h2 id="quick-support-heading" className="text-lg font-semibold">
              {t('title')}
            </h2>
            <p className="mt-1 text-sm text-textcolor-secondary">{t('description')}</p>
          </div>
          <p className="text-sm leading-relaxed">{t('groundingPrompt')}</p>
          <div className="flex flex-wrap gap-sm">
            <Button asChild variant="default" size="medium" className="min-h-11">
              <Link href={`${Routes.GUIDE}/breathing`}>{t('breathingAction')}</Link>
            </Button>
            <Button asChild variant="secondary" size="medium" className="min-h-11">
              <Link href={`${Routes.GUIDE}/calming`}>{t('calmingAction')}</Link>
            </Button>
          </div>
          {showHelpfulReturn && (
            <Suspense fallback={null}>
              <HelpfulReturnPrompt />
            </Suspense>
          )}
          <p className="text-xs text-textcolor-secondary">{t('optionalNote')}</p>
        </div>
      </SectionCard>
    </section>
  )
}
