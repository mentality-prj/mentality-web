import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import { TestHistoryChart } from '@/components/features/TestsQuestionnarie/TestHistoryChart'
import { TestPageGenerator } from '@/components/features/TestsQuestionnarie/TestPageGenerator'
import { TestDisclaimer } from '@/components/shared/TestDisclaimer'
import { K10_LEVEL_MAP, K10_TEST_CONFIG } from '@/config/k10.config'

export default async function TestGeneratorPage() {
  const [session, t] = await Promise.all([auth(), getTranslations('pages.K10')])
  const userId = session?.user?.id ?? ''
  const isAdmin = session?.user?.role === 'admin'

  const config = {
    ...K10_TEST_CONFIG,
    title: t('intro.title'),
    questions: K10_TEST_CONFIG.questions.map((q, i) => ({
      ...q,
      text: t(`questions.q${i}` as Parameters<typeof t>[0]),
      options: q.options.map((opt) => ({
        ...opt,
        text: t(`options.${opt.value}` as Parameters<typeof t>[0]),
      })),
    })),
    resultMapping: K10_LEVEL_MAP.map((s) => ({
      min: s.min,
      max: s.max,
      label: t(`level.${s.label}` as Parameters<typeof t>[0]),
    })),
    scoreLabel: t('result.scoreLabel'),
    categoryTitle: t('result.levelLabel'),
    summaryTitle: t('result.recommendationTitle'),
    ctaRetryLabel: t('result.ctaRetry'),
    ctaProgramLabel: t('result.ctaProgram'),
  }

  return (
    <div className="flex flex-col gap-md">
      <div className="flex flex-col gap-6 laptop:flex-row laptop:items-start">
        <div className="flex flex-col gap-6 laptop:w-[60%]">
          <p className="text-sm text-textcolor-secondary">{t('page.description')}</p>
          <TestPageGenerator test={config} userId={userId} isAdmin={isAdmin} />
          <TestDisclaimer text={t('page.disclaimer')} />
        </div>

        {config.apiEndpoint && config.maxScore && (
          <div className="flex flex-col gap-6 laptop:w-[40%]">
            <Suspense
              fallback={
                <div className="border-outline-secondary flex h-48 items-center justify-center rounded-xl border bg-background-soft">
                  <span className="text-sm text-textcolor-secondary">{t('page.loadingHistory')}</span>
                </div>
              }
            >
              <TestHistoryChart
                apiEndpoint={config.apiEndpoint}
                maxScore={config.maxScore}
                chartLabel="K10"
                title={t('chart.title')}
                stubTitle={t('chart.stubNote')}
              />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  )
}
