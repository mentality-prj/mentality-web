import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import { NextTestBanner } from '@/components/features/PsychologicalTests/NextTestBanner'
import { HistoryChartLoader } from '@/components/features/TestsQuestionnarie/HistoryChartLoader'
import { TestHistoryChart } from '@/components/features/TestsQuestionnarie/TestHistoryChart'
import { TestPageGenerator } from '@/components/features/TestsQuestionnarie/TestPageGenerator'
import { TestDisclaimer } from '@/components/shared/TestDisclaimer'
import { K10_LEVEL_MAP, K10_TEST_CONFIG } from '@/config/k10.config'
import { Routes } from '@/constants/routes'

export default async function TestGeneratorPage() {
  const [session, t, tNext] = await Promise.all([
    auth(),
    getTranslations('pages.K10'),
    getTranslations('pages.PsychologicalTests'),
  ])
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
      <div className="flex flex-col gap-sm laptop:flex-row laptop:items-start">
        <div className="flex flex-col gap-sm laptop:w-[60%]">
          <p className="text-sm text-textcolor-secondary">{t('page.description')}</p>
          <TestPageGenerator test={config} userId={userId} isAdmin={isAdmin} />
          <TestDisclaimer text={t('page.disclaimer')} />
          <NextTestBanner
            nextHref={Routes.ANXIETY_CHECK}
            label={tNext('nextTest.well-being-check.label')}
            title={tNext('nextTest.well-being-check.title')}
            description={tNext('nextTest.well-being-check.description')}
            hint={tNext('nextTest.well-being-check.hint')}
            cta={tNext('nextTest.well-being-check.cta')}
          />
        </div>

        {config.apiEndpoint && config.maxScore && (
          <div className="flex flex-col gap-sm laptop:w-[40%]">
            <Suspense fallback={<HistoryChartLoader label={t('page.loadingHistory')} />}>
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
