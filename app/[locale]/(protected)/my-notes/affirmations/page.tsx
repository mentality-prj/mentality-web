import { getLocale, getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import { AffirmationHistory } from '@/components/AffirmationsAndTips/AffirmationHistory'
import { Breadcrumbs } from '@/ds/components/Breadcrumbs'
import CustomCard from '@/ds/components/CustomCard'
import { PageTitle } from '@/ds/components/PageTitle'
import { StarIcon } from '@/ds/icons/star'
import { getAffirmations } from '@/requests/affirmations'
import { getTips } from '@/requests/tips'
import { SupportedLanguage } from '@/types/languages'

export default async function AffirmationsPage() {
  const session = await auth()
  const affirmRes = await getAffirmations(session, 1, 1)
  const tipRes = await getTips(session, 1, 1)
  const t = await getTranslations()
  const locale = (await getLocale()) as SupportedLanguage

  const dailyAffirmation = 'error' in affirmRes ? null : (affirmRes.data?.items ?? [])[0]
  const dailyTip = 'error' in tipRes ? null : (tipRes.data?.items ?? [])[0]

  return (
    <div className="flex flex-col gap-8">
      <Breadcrumbs
        currentPage={t('pages.AffirmationsPage.title')}
        breadcrumbList={[
          { title: `${t('common.Breadcrumbs.breadcrumbsList', { title: 'affirmation' })}`, href: '/my-notes' },
        ]}
      />
      <PageTitle title={t('pages.AffirmationsPage.title')} subtitle={t('pages.AffirmationsPage.subtitle')} />
      <div className="grid grid-cols-1 gap-default laptop:grid-cols-2">
        {/* TODO:  move components to a separate component (i18n as well)*/}
        <CustomCard
          title={t('pages.AffirmationsPage.affirmation.title')}
          text={`${dailyAffirmation?.translations?.[`${locale}`] ?? ''}`}
          button={<StarIcon />}
          variant="daily"
        />
        <CustomCard
          title={t('pages.AffirmationsPage.tip.title')}
          text={`${dailyTip?.translations?.[`${locale}`] ?? ''}`}
          button={<StarIcon />}
          variant="daily"
        />
      </div>

      <AffirmationHistory />
    </div>
  )
}
