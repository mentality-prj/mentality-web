import { getLocale, getTranslations } from 'next-intl/server'

import { AffirmationHistory } from '@/components/AffirmationsAndTips/AffirmationHistory'
import { Breadcrumbs } from '@/ds/components/Breadcrumbs'
import CustomCard from '@/ds/components/CustomCard'
import { PageTitle } from '@/ds/components/PageTitle'
import { StarIcon } from '@/ds/icons/star'
import { mockDailyAffirmation, mockDailyTip } from '@/REST/mockApi'
import { SupportedLanguage } from '@/types/languages'

export default async function AffirmationsPage() {
  const dailyAffirmation = await mockDailyAffirmation()
  const t = await getTranslations()
  const dailyTip = await mockDailyTip()
  const locale = (await getLocale()) as SupportedLanguage

  return (
    <div className="flex flex-col gap-8">
      <Breadcrumbs
        currentPage={t('common.PageTitle.title', { title: 'affirmation' })}
        breadcrumbList={[
          { title: `${t('common.Breadcrumbs.breadcrumbsList', { title: 'affirmation' })}`, href: '/my-notes' },
        ]}
      />
      <PageTitle
        title={t('common.PageTitle.title', { title: 'affirmation' })}
        subtitle={t('common.PageTitle.subtitle', { subtitle: 'affirmation' })}
      />
      <div className="grid grid-cols-1 gap-6 laptop:grid-cols-2">
        {/* TODO:  move components to a separate component (i18n as well)*/}
        <CustomCard
          title={t('pages.AffirmationsPage.affirmation.title')}
          text={`${dailyAffirmation.translations[`${locale}`]}`}
          button={<StarIcon />}
          variant="daily"
        />
        <CustomCard
          title={t('pages.AffirmationsPage.tip.title')}
          text={`${dailyTip.translations[`${locale}`]}`}
          button={<StarIcon />}
          variant="daily"
        />
      </div>

      <AffirmationHistory />
    </div>
  )
}
