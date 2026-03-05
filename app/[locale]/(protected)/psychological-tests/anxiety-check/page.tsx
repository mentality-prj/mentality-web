import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import Gad7Form from '@/components/gad7/Gad7Form'
import Gad7HistoryChart from '@/components/gad7/Gad7HistoryChart'
import TestDisclaimer from '@/components/shared/TestDisclaimer'

export default async function AnxietyCheckPage() {
  const [session, t] = await Promise.all([auth(), getTranslations('pages.AnxietyCheck')])
  const userId = session?.user?.id ?? ''
  const isAdmin = session?.user?.role === 'admin'

  return (
    <div className="flex flex-col gap-md">
      <div className="flex flex-col gap-6 laptop:flex-row laptop:items-start">
        {/* Main form column — 60% */}
        <div className="flex flex-col gap-6 laptop:w-[60%]">
          <p className="text-sm text-textcolor-secondary">{t('page.description')}</p>
          <Gad7Form userId={userId} isAdmin={isAdmin} />

          <TestDisclaimer text={t('page.disclaimer')} />
        </div>

        {/* Side column: history — 40% */}
        <div className="flex flex-col gap-6 laptop:w-[40%]">
          <Suspense
            fallback={
              <div className="border-outline-secondary flex h-48 items-center justify-center rounded-xl border bg-background-soft">
                <span className="text-sm text-textcolor-secondary">{t('page.loadingHistory')}</span>
              </div>
            }
          >
            <Gad7HistoryChart />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
