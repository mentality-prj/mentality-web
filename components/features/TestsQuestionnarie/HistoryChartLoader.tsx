import { SummaryCard } from '@/components/shared/Cards/SummaryCard'

export function HistoryChartLoader({ label }: { label: string }) {
  return (
    <SummaryCard className="gap-0 max-md:mt-6 max-md:border-t max-md:border-border max-md:pt-6" title={label}>
      <div aria-hidden="true" className="bg-muted/40 mt-4 h-40 w-full rounded-md" />
    </SummaryCard>
  )
}
