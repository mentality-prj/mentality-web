import { getTranslations } from 'next-intl/server'

import MoodRecordsList from '@/components/MoodTracker/MoodRecords/MoodRecordsList/MoodRecordsList'
import type { MoodRecordEntity } from '@/types/api-responses'

type Props = {
  records?: MoodRecordEntity[]
}

export default async function MoodRecords({ records }: Props) {
  const mt = await getTranslations('components.Mood')
  const hasRecords = Boolean(records && records.length > 0)

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{mt('History.Title')}</h3>
          {!hasRecords && <p className="mt-1 text-sm text-gray-500">{mt('History.Empty')}</p>}
        </div>
      </div>

      {hasRecords && (
        <div className="mt-6">
          <MoodRecordsList records={records!} />
        </div>
      )}
    </div>
  )
}
