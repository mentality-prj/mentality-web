import { getTranslations } from 'next-intl/server'

import { MySpace } from '@/components/MySpace/MySpace'
import { PageTitle } from '@/ds/components/PageTitle'

export default async function MySpacePage() {
  const t = await getTranslations('pages.MySpace')

  return (
    <article>
      <PageTitle title={t('title')} subtitle={t('subtitle')} />
      <MySpace />
    </article>
  )
}
