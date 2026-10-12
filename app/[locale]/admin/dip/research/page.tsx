import { getTranslations } from 'next-intl/server'

import { ResearchView } from '@/components/features/Dip/ResearchView'
import { getDipOrganizations, getDipOrgConnectionStatus, getDipWorkflows } from '@/requests/dipClient'

export default async function DipResearchPage({ searchParams }: { searchParams: Promise<{ org?: string }> }) {
  const query = await searchParams
  const [t, organizations, connection] = await Promise.all([
    getTranslations('pages.Dip'),
    getDipOrganizations(),
    Promise.resolve(getDipOrgConnectionStatus()),
  ])

  const selectedOrgId =
    query.org && organizations.some((org) => org.id === query.org) ? query.org : (organizations[0]?.id ?? null)
  const workflows = await getDipWorkflows(selectedOrgId)

  return <ResearchView workflows={workflows} connection={connection} t={t} />
}
