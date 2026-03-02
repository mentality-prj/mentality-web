import { getTranslations } from 'next-intl/server'

import PsychologicalTestsInnerMenu from '@/components/features/PsychologicalTests/PsychologicalTestsInnerMenu'
import { PageTitle } from '@/ds/components/PageTitle'

export default async function PsychologicalTestsLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations('pages.PsychologicalTests')

  return (
    <div className="flex flex-col gap-md">
      <PageTitle title={t('title')} subtitle={t('subtitle')} />
      <PsychologicalTestsInnerMenu />
      {children}
    </div>
  )
}
