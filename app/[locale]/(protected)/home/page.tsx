import { getLocale, getTranslations } from 'next-intl/server'

import { GreetingTitleWrapper } from '@/components/GreetingTitle/GreetingTitleWrapper'
import CustomCard from '@/ds/components/CustomCard'
import { StarIcon } from '@/ds/icons/star'
import { mockDailyAffirmation, mockDailyTip } from '@/REST/mockApi'
import { SupportedLanguage } from '@/types/languages'

export default async function Home() {
  const dailyAffirmation = await mockDailyAffirmation()
  const t = await getTranslations('components.DailyCard')
  const dailyTip = await mockDailyTip()
  const locale = (await getLocale()) as SupportedLanguage

  return (
    <div className="flex flex-col gap-4">
      <GreetingTitleWrapper />

      <div className="flex flex-col gap-4 laptop:grid laptop:grid-cols-2">
        <div className="grid items-stretch justify-items-stretch gap-4 tablet:grid-cols-2 laptop:grid-cols-1">
          <CustomCard
            title={t('title', { type: 'affirmation' })}
            text={`${dailyAffirmation.translations[`${locale}`]}`}
            textLink={t('buttonText', { type: 'affirmation' })}
            button={<StarIcon />}
            hrefLink="/"
            variant="daily"
          />
          <CustomCard
            title={t('title', { type: 'tip' })}
            text={`${dailyTip.translations[`${locale}`]}`}
            textLink={t('buttonText', { type: 'tip' })}
            hrefLink="/"
            button={<StarIcon />}
            variant="daily"
          />
        </div>
      </div>
    </div>
  )
}
