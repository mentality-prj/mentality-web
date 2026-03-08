import { Suspense } from 'react'

import { auth } from '@/auth'
import { k10Test } from '@/components/features/TestsQuestionnarie/consts/tests-questionnaire/k10'
import { TestHistoryChart } from '@/components/features/TestsQuestionnarie/TestHistoryChart'
import { TestPageGenerator } from '@/components/features/TestsQuestionnarie/TestPageGenerator'

export default async function TestGeneratorPage() {
  const session = await auth()
  const userId = session?.user?.id ?? ''
  const isAdmin = session?.user?.role === 'admin'

  return (
    <div className="flex flex-col gap-md">
      <div className="flex flex-col gap-6 laptop:flex-row laptop:items-start">
        <div className="flex flex-col gap-6 laptop:w-[60%]">
          <TestPageGenerator test={k10Test} userId={userId} isAdmin={isAdmin} />
        </div>

        {k10Test.apiEndpoint && k10Test.maxScore && (
          <div className="flex flex-col gap-6 laptop:w-[40%]">
            <Suspense
              fallback={
                <div className="border-outline-secondary flex h-48 items-center justify-center rounded-xl border bg-background-soft">
                  <span className="text-sm text-textcolor-secondary">Завантаження графіку...</span>
                </div>
              }
            >
              <TestHistoryChart apiEndpoint={k10Test.apiEndpoint} maxScore={k10Test.maxScore} chartLabel="K10" />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  )
}
