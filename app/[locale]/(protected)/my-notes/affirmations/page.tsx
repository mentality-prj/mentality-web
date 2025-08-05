import { useTranslations } from 'next-intl'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { DailyCard } from '@/components/ui/DailyCard'
import { PageTitle } from '@/components/ui/PageTitle'
import { SectionCard } from '@/components/ui/SectionCard'
import { AstronomyIcon } from '@/ds/icons/blueIcons/astronomy'
import { StarRingIcon } from '@/ds/icons/blueIcons/star-ring'

export default function AffirmationsPage() {
  const t = useTranslations('AffirmationsPage')
  return (
    <div className="flex flex-col gap-8">
      <Breadcrumbs
        currentPage={t('title')}
        breadcrumbList={[{ title: `${t('ThoughtsList.title')}`, href: '/my-notes' }]}
      />
      <PageTitle title={t('title')} subtitle={t('subtitle')} />
      <div className="grid grid-cols-1 gap-6 laptop:grid-cols-2">
        <DailyCard
          variant="secondary"
          toastText={t('toast.affirmation')}
          title={t('affirmation.title')}
          textContent={t('affirmation.text')}
          icon={<StarRingIcon />}
        />
        <DailyCard
          toastText={t('toast.tip')}
          variant="secondary"
          title={t('tip.title')}
          textContent={t('tip.text')}
          icon={<AstronomyIcon />}
        />
      </div>
      <SectionCard title={t('sectionCard.title')} subtitle={t('sectionCard.subtitle')} />
    </div>
  )
}
