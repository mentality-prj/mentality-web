import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import { NextTestBanner } from '@/components/features/PsychologicalTests/NextTestBanner'
import { HistoryChartLoader } from '@/components/features/TestsQuestionnarie/HistoryChartLoader'
import { TestHistoryChart } from '@/components/features/TestsQuestionnarie/TestHistoryChart'
import { TestPageGenerator } from '@/components/features/TestsQuestionnarie/TestPageGenerator'
import { TestDisclaimer } from '@/components/shared/TestDisclaimer'
import { GAD7_HIGH_SCORE_THRESHOLD, GAD7_LEVEL_MAP, GAD7_MAX_SCORE, GAD7_TEST_CONFIG } from '@/config/gad7.config'
import { Routes } from '@/constants/routes'

export default async function AnxietyCheckPage() {
  const [session, t, tNext] = await Promise.all([
    auth(),
    getTranslations('pages.AnxietyCheck'),
    getTranslations('pages.PsychologicalTests'),
  ])
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
      <div className="flex flex-col gap-sm laptop:flex-row laptop:items-start">
        <div className="flex flex-col gap-sm laptop:w-[60%]">
          <p className="text-sm text-textcolor-secondary">{t('page.description')}</p>
          <TestPageGenerator test={config} userId={userId} isAdmin={isAdmin} />
          <TestDisclaimer text={t('page.disclaimer')} />
          <NextTestBanner
            nextHref={Routes.MENTAL_CHECK}
            label={tNext('nextTest.anxiety-check.label')}
            title={tNext('nextTest.anxiety-check.title')}
            description={tNext('nextTest.anxiety-check.description')}
            hint={tNext('nextTest.anxiety-check.hint')}
            cta={tNext('nextTest.anxiety-check.cta')}
          />
        </div>

        <div className="flex flex-col gap-sm laptop:w-[40%]">
          <Suspense fallback={<HistoryChartLoader label={t('page.loadingHistory')} />}>
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
