import { getTranslations } from 'next-intl/server'

import { DataView } from '@/components/features/Dip/DataView'
import { getDipFeatures, getDipOrganizations, getDipOrgConnectionStatus } from '@/requests/dipClient'

export default async function DipDataPage({ searchParams }: { searchParams: Promise<{ org?: string }> }) {
  const query = await searchParams
  const [t, organizations, connection] = await Promise.all([
    getTranslations('pages.Dip'),
    getDipOrganizations(),
    Promise.resolve(getDipOrgConnectionStatus()),
  ])

  const selectedOrgId =
    query.org && organizations.some((org) => org.id === query.org) ? query.org : (organizations[0]?.id ?? null)
  const features = await getDipFeatures(selectedOrgId)

  return <DataView features={features} connection={connection} t={t} />
}
