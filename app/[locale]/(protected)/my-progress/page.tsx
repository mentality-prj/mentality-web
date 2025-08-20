import { useTranslations } from 'next-intl'

import { Achievements } from '@/components/Achievements'
import { PageTitle } from '@/components/ui/PageTitle'

export default function MyProgress() {
  const t = useTranslations('MyProgress')
  return (
    <div className="flex flex-col gap-8">
      <PageTitle title={t('PageTitle.title')} subtitle={t('PageTitle.subtitle')} />
      <Achievements />
    </div>
  )
}
