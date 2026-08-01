import { getTranslations } from 'next-intl/server'

import { ModelsView } from '@/components/features/Dip/ModelsView'
import { getDipOrgConnectionStatus } from '@/requests/dipClient'

export default async function DipModelsPage() {
  const [t, connection] = await Promise.all([
    getTranslations('pages.Dip'),
    Promise.resolve(getDipOrgConnectionStatus()),
  ])

  return <ModelsView connection={connection} t={t} />
}
