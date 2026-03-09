import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import { TestHistoryChart } from '@/components/features/TestsQuestionnarie/TestHistoryChart'
import { TestPageGenerator } from '@/components/features/TestsQuestionnarie/TestPageGenerator'
import { TestDisclaimer } from '@/components/shared/TestDisclaimer'
import { GAD7_HIGH_SCORE_THRESHOLD, GAD7_LEVEL_MAP, GAD7_MAX_SCORE, GAD7_TEST_CONFIG } from '@/config/gad7.config'

export default async function AnxietyCheckPage() {
  const [session, t] = await Promise.all([auth(), getTranslations('pages.AnxietyCheck')])
  const userId = session?.user?.id ?? ''
  const isAdmin = session?.user?.role === 'admin'

  const config = {
    ...GAD7_TEST_CONFIG,
    title: t('intro.title'),
    questions: GAD7_TEST_CONFIG.questions.map((q, i) => ({
      ...q,
      text: t(`questions.q${i}` as Parameters<typeof t>[0]),
      options: q.options.map((opt) => ({
        ...opt,
        text: t(`options.${opt.value}` as Parameters<typeof t>[0]),
      })),
    })),
    resultMapping: GAD7_LEVEL_MAP.map((s) => ({
      min: s.min,
      max: s.max,
      label: t(`level.${s.label}` as Parameters<typeof t>[0]),
    })),
    scoreLabel: t('result.scoreLabel'),
    categoryTitle: t('result.levelLabel'),
    summaryTitle: t('result.recommendationTitle'),
    ctaRetryLabel: t('result.ctaRetry'),
    ctaProgramLabel: t('result.ctaProgram'),
    alertThreshold: GAD7_HIGH_SCORE_THRESHOLD,
    staticAlertText: t('result.supportiveMessage'),
  }

  return (
    <div className="flex flex-col gap-md">
      <div className="flex flex-col gap-6 laptop:flex-row laptop:items-start">
        <div className="flex flex-col gap-6 laptop:w-[60%]">
          <p className="text-sm text-textcolor-secondary">{t('page.description')}</p>
          <TestPageGenerator test={config} userId={userId} isAdmin={isAdmin} />
          <TestDisclaimer text={t('page.disclaimer')} />
        </div>

        <div className="flex flex-col gap-6 laptop:w-[40%]">
          <Suspense
            fallback={
              <div className="border-outline-secondary flex h-48 items-center justify-center rounded-xl border bg-background-soft">
                <span className="text-sm text-textcolor-secondary">{t('page.loadingHistory')}</span>
              </div>
            }
          >
            <TestHistoryChart
              apiEndpoint="gad7"
              maxScore={GAD7_MAX_SCORE}
              chartLabel="GAD-7"
              title={t('chart.title')}
              stubTitle={t('chart.stubNote')}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
