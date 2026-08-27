import { DecisionsView } from '@/components/features/Dip/DecisionsView'
import { getDipDecisions, getDipOrganizations, getDipOrgConnectionStatus } from '@/requests/dipClient'

export default async function DipDecisionsPage({ searchParams }: { searchParams: Promise<{ org?: string }> }) {
  const query = await searchParams
  const [organizations, connection] = await Promise.all([
    getDipOrganizations(),
    Promise.resolve(getDipOrgConnectionStatus()),
  ])

  const selectedOrgId =
    query.org && organizations.some((org) => org.id === query.org) ? query.org : (organizations[0]?.id ?? null)
  const decisions = await getDipDecisions(100, selectedOrgId)

  return <DecisionsView decisions={decisions} connection={connection} />
}
