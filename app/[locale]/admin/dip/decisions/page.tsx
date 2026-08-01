import { DecisionsView } from '@/components/features/Dip/DecisionsView'
import { getDipDecisions, getDipOrgConnectionStatus } from '@/requests/dipClient'

export default async function DipDecisionsPage() {
  const [decisions, connection] = await Promise.all([
    getDipDecisions(100),
    Promise.resolve(getDipOrgConnectionStatus()),
  ])

  return <DecisionsView decisions={decisions} connection={connection} />
}
