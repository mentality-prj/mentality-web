import { Suspense } from 'react'
import { CircleAlert } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import Phq9Form from '@/components/phq9/Phq9Form'
import Phq9HistoryChart from '@/components/phq9/Phq9HistoryChart'
import Card from '@/components/shared/Cards/Card'

export default async function MentalCheckPage() {
  const [session, t] = await Promise.all([auth(), getTranslations('pages.MentalCheck')])
  const userId = session?.user?.id ?? ''
  const isAdmin = session?.user?.role === 'admin'

  return (
    <div className="flex flex-col gap-md">
      <div className="flex flex-col gap-6 laptop:flex-row laptop:items-start">
        {/* Main form column — 60% */}
        <div className="flex flex-col gap-6 laptop:w-[60%]">
          <Phq9Form userId={userId} isAdmin={isAdmin} />

          {/* Disclaimer */}
          <Card type="note">
            <div className="flex flex-row items-center gap-xs text-sm">
              <CircleAlert size={32} className="text-white opacity-50" />
              {t('page.disclaimer')}
            </div>
          </Card>
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
            <Phq9HistoryChart />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
