import { getTranslations } from 'next-intl/server'

import { ResearchView } from '@/components/features/Dip/ResearchView'
import { getDipOrgConnectionStatus, getDipWorkflows } from '@/requests/dipClient'

export default async function DipResearchPage() {
  const [t, workflows, connection] = await Promise.all([
    getTranslations('pages.Dip'),
    getDipWorkflows(),
    Promise.resolve(getDipOrgConnectionStatus()),
  ])

  return <ResearchView workflows={workflows} connection={connection} t={t} />
}
