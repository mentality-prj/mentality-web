import { getTranslations } from 'next-intl/server'

import { PageTitle } from '@/components/ui/PageTitle'

export default async function Reminder() {
  const t = await getTranslations('Guide.PageTitle')

  return (
    <div className="flex flex-col gap-8">
      <PageTitle title={t('title')} subtitle={t('subtitle')} />
    </div>
  )
}
