import { SunIcon } from '@/ds/icons/summary/sun'

import { SummaryCard } from './SummaryCard'

export const BestDay = () => {
  return (
    <SummaryCard icon={<SunIcon />} title="Твій найкращий день">
      <div className="text-sm text-textcolor-tertiary">
        Твій найкращий день ще попереду! Відмічай настрій, щоб побачити його тут
      </div>
    </SummaryCard>
  )
}
