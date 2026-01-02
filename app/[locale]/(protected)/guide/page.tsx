import { getTranslations } from 'next-intl/server'

import MyGuideWrapper from '@/components/MyGuide/MyGuideWrapper'
import { PageTitle } from '@/ds/components/PageTitle'

export default async function Guide({ searchParams }: { searchParams?: { tab?: string } }) {
  const t = await getTranslations('common.PageTitle')

  return (
    <>
      <PageTitle title={t('title', { title: 'guide' })} subtitle={t('subtitle', { subtitle: 'guide' })} />
      <MyGuideWrapper initialTab={searchParams?.tab} />
    </>
  )
}
