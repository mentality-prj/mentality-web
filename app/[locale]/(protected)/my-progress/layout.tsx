import { useTranslations } from 'next-intl'

import { PageTitle } from '@/ds/components/PageTitle'

import MyProgressInnerMenu from '../../../../components/MyProgress/MyProgressInnerMenu/MyProgressInnerMenu'

export default function MyProgressLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations()
  return (
    <div className="flex flex-col gap-md">
      <PageTitle title={t('pages.MyProgress.title')} subtitle={t('pages.MyProgress.subtitle')} />
      <MyProgressInnerMenu />
      {children}
    </div>
  )
}
