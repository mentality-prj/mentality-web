import { getTranslations } from 'next-intl/server'

import MyGuideWrapper from '@/components/MyGuide/MyGuideWrapper'
import { PageTitle } from '@/ds/components/PageTitle'

export default async function Guide() {
  const t = await getTranslations('Guide.PageTitle')

  return (
    <div className="flex flex-col gap-8">
      <PageTitle title={t('title')} subtitle={t('subtitle')} />
      <MyGuideWrapper />
    </div>
  )
}
