import { getTranslations } from 'next-intl/server'

import { MySpace } from '@/components/MyNotes/MySpace'
import { PageTitle } from '@/ds/components/PageTitle'

export default async function MyNotes() {
  const t = await getTranslations('pages.MyNotes')

  return (
    <article>
      <PageTitle title={t('title')} subtitle={t('subtitle')} />
      <MySpace />
    </article>
  )
}
