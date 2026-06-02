import { PersonalRiskDashboard } from '@/components/features/Statistics/PersonalRiskDashboard'
import { getReportingCopy } from '@/helpers/reportingCopy'
import { getServerSession } from '@/lib/get-server-session'
import { getPersonalRiskDashboardVM } from '@/requests/reportingClient'

export default async function MyProgressStatisticsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await getServerSession()
  const copy = getReportingCopy(locale)

  const dashboard = await getPersonalRiskDashboardVM(session, locale)

  if ('error' in dashboard) {
    return (
      <div className="flex items-center justify-center py-16">
        <span className="text-textcolor-secondary">{copy.common.loadFailed}</span>
      </div>
    )
  }

  return <PersonalRiskDashboard overview={dashboard.data.overview} timelines={dashboard.data.timelines} />
}
