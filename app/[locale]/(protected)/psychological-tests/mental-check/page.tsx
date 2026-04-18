import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'

import { NextTestBanner } from '@/components/features/PsychologicalTests/NextTestBanner'
import { HistoryChartLoader } from '@/components/features/TestsQuestionnarie/HistoryChartLoader'
import { TestHistoryChart } from '@/components/features/TestsQuestionnarie/TestHistoryChart'
import { TestPageGenerator } from '@/components/features/TestsQuestionnarie/TestPageGenerator'
import { TestDisclaimer } from '@/components/shared/TestDisclaimer'
import { PHQ9_MAX_SCORE, PHQ9_SEVERITY_MAP, PHQ9_TEST_CONFIG } from '@/config/phq9.config'
import { Routes } from '@/constants/routes'
import { getServerSession } from '@/lib/get-server-session'

export default async function MentalCheckPage() {
  const [session, t, tNext] = await Promise.all([
    getServerSession(),
    getTranslations('pages.MentalCheck'),
    getTranslations('pages.PsychologicalTests'),
  ])
  const userId = session?.user?.id ?? ''
  const isAdmin = session?.user?.role === 'admin'

  const config = {
    ...PHQ9_TEST_CONFIG,
    title: t('intro.title'),
    questions: PHQ9_TEST_CONFIG.questions.map((q, i) => ({
      ...q,
      text: t(`questions.q${i}` as Parameters<typeof t>[0]),
      options: q.options.map((opt) => ({
        ...opt,
        text: t(`options.${opt.value}` as Parameters<typeof t>[0]),
      })),
    })),
    resultMapping: PHQ9_SEVERITY_MAP.map((s) => ({
      min: s.min,
      max: s.max,
      label: t(`severity.${s.label}` as Parameters<typeof t>[0]),
    })),
    scoreLabel: t('result.mentalityIndexLabel'),
    categoryTitle: t('result.severityLabel'),
    summaryTitle: t('result.interpretationTitle'),
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
            label={tNext('nextTest.mental-check.label')}
            title={tNext('nextTest.mental-check.title')}
            description={tNext('nextTest.mental-check.description')}
            hint={tNext('nextTest.mental-check.hint')}
            cta={tNext('nextTest.mental-check.cta')}
            nextHref={Routes.PSYCHOLOGICALTESTS}
            isDone
          />
        </div>

        <div className="flex flex-col gap-sm laptop:w-[40%]">
          <Suspense fallback={<HistoryChartLoader label={t('page.loadingHistory')} />}>
            <TestHistoryChart
              apiEndpoint="phq9"
              maxScore={PHQ9_MAX_SCORE}
              chartLabel="PHQ-9"
              title={t('chart.title')}
              stubTitle={t('chart.stubNote')}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
