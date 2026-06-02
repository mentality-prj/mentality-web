'use client'

import { AdminReportOverview } from '@/components/features/Company/Manager/DecisionSupport/AdminReportOverview'
import { RiskEventsFeed } from '@/components/features/Company/Manager/DecisionSupport/RiskEventsFeed'
import { useReportOverview } from '@/hooks/useReportOverview'
import { useRiskEventsFeed } from '@/hooks/useRiskEventsFeed'
import { ViewerRole } from '@/types/reporting'

type Props = {
  viewerRole: ViewerRole
}

export function DecisionSupportWorkspace({ viewerRole }: Props) {
  const preferManagerScope = viewerRole === 'manager'
  const reportOverview = useReportOverview(preferManagerScope)
  const riskFeed = useRiskEventsFeed(preferManagerScope)

  return (
    <div className="flex flex-col gap-6">
      <AdminReportOverview
        overview={reportOverview.overview}
        loading={reportOverview.loading}
        error={reportOverview.error}
        viewerRole={viewerRole}
        onRetry={reportOverview.refresh}
      />

      <RiskEventsFeed
        viewerRole={viewerRole}
        mode="operational"
        riskEvents={riskFeed.riskEvents}
        loading={riskFeed.loading}
        error={riskFeed.error}
        processingEventIds={riskFeed.processingEventIds}
        loadingDetailIds={riskFeed.loadingDetailIds}
        detailsByEventId={riskFeed.detailsByEventId}
        onRetry={riskFeed.refresh}
        onOpenDetails={riskFeed.fetchDetails}
        onApplyAction={riskFeed.applyAction}
        onResolve={riskFeed.resolveRisk}
      />
    </div>
  )
}
