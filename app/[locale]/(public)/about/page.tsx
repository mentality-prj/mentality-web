import { useTranslations } from 'next-intl'

import { List } from '@/app/[locale]/(public)/components/List'
import CardContainer from '@/components/shared/Cards/CardContainer'
import { PageTitle } from '@/ds/components/PageTitle'
import { SectionCard } from '@/ds/components/SectionCard'
import { Statuses } from '@/types/status.types'

const forWhomConfig = [
  { key: 'business', type: Statuses.note },
  { key: 'user', type: Statuses.info },
  { key: 'research', type: Statuses.success },
] as const

const architectureConfig = [
  { key: 'core', type: Statuses.support },
  { key: 'b2c', type: Statuses.info },
  { key: 'loop', type: Statuses.note },
] as const

export default function AboutPage() {
  const t = useTranslations('pages.About')

  return (
    <div className="flex flex-col gap-12 px-4 py-12 tablet:px-6 md:px-8 lg:px-10">
      {/* Hero */}
      <div className="container-max-width mx-auto w-full">
        <PageTitle title={t('title')} />
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-textcolor-secondary">{t('intro')}</p>
      </div>

      {/* Evolution */}
      <CardContainer>
        <div className="rounded-[40px] bg-background-muted p-6 md:p-8 lg:p-10">
          <h2 className="landing-h2">{t('Evolution.title')}</h2>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-textcolor-secondary">
            {t('Evolution.description')}
          </p>
          <List
            className="mt-6"
            items={(['happened', 'means', 'next', 'action', 'evidence'] as const).map((key) =>
              t(`Evolution.steps.${key}`)
            )}
            keyExtractor={(item) => item?.toString() ?? ''}
          />
        </div>
      </CardContainer>

      {/* For whom */}
      <div className="container-max-width mx-auto w-full">
        <h2 className="landing-h2 mb-6">{t('ForWhom.title')}</h2>
        <div className="grid grid-cols-1 gap-default md:grid-cols-3">
          {forWhomConfig.map(({ key, type }) => (
            <SectionCard
              key={key}
              type={type}
              title={t(`ForWhom.${key}.title`)}
              subtitle={t(`ForWhom.${key}.description`)}
            />
          ))}
        </div>
      </div>

      {/* Architecture */}
      <div className="container-max-width mx-auto w-full">
        <h2 className="landing-h2 mb-6">{t('Architecture.title')}</h2>
        <div className="grid grid-cols-1 gap-default md:grid-cols-3">
          {architectureConfig.map(({ key, type }) => (
            <SectionCard
              key={key}
              type={type}
              title={t(`Architecture.${key}.title`)}
              subtitle={t(`Architecture.${key}.description`)}
            />
          ))}
        </div>
      </div>

      {/* Value */}
      <div className="container-max-width mx-auto w-full">
        <div className="rounded-[40px] bg-background-muted p-6 md:p-8 lg:p-10">
          <h2 className="landing-h2">{t('Value.title')}</h2>
          <p className="mt-1 text-sm text-textcolor-secondary">{t('Value.description')}</p>
          <ul className="mt-6 list-disc space-y-2 pl-6 text-sm leading-relaxed text-textcolor-primary">
            {(['cohort', 'explainable', 'outcome'] as const).map((key) => {
              const point = t(`Value.points.${key}`)
              return <li key={point}>{point}</li>
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
