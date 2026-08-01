import { getTranslations } from 'next-intl/server'

import { DataView } from '@/components/features/Dip/DataView'
import { getDipFeatures, getDipOrgConnectionStatus } from '@/requests/dipClient'

export default async function DipDataPage() {
  const [t, features, connection] = await Promise.all([
    getTranslations('pages.Dip'),
    getDipFeatures(),
    Promise.resolve(getDipOrgConnectionStatus()),
  ])

  return <DataView features={features} connection={connection} t={t} />
}
