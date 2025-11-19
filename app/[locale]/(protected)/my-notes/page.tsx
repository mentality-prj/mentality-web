import { getTranslations } from 'next-intl/server'

import { ExcersisesFoeRecovery } from '@/components/MyNotes/ExcersisesForRecovery'
import { MySpace } from '@/components/MyNotes/MySpace'
import { PageTitle } from '@/ds/components/PageTitle'

export default async function MyNotes() {
  const t = await getTranslations('MyNotesPage')

  return (
    <div className="flex flex-col gap-8">
      <PageTitle title={t('title')} subtitle={t('subtitle')} />
      <MySpace />
      <ExcersisesFoeRecovery />
    </div>
  )
}
