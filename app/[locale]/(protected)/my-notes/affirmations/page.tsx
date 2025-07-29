import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { DailyCard } from '@/components/ui/DailyCard'
import { PageTitle } from '@/components/ui/PageTitle'
import { SectionCard } from '@/components/ui/SectionCard'
import { AstronomyIcon } from '@/ds/icons/blueIcons/astronomy'
import { StarRingIcon } from '@/ds/icons/blueIcons/star-ring'

export default function AffirmationsPage() {
  return (
    <div className="flex flex-col gap-8">
      <Breadcrumbs currentPage="Афірмації та поради" breadcrumbList={[{ title: 'Мої записи', href: '/my-notes' }]} />
      <PageTitle title="Афірмації та поради" subtitle="Надихайся позитивними думками кожного дня" />
      <div className="grid grid-cols-1 gap-6 laptop:grid-cols-2">
        <DailyCard
          variant="secondary"
          title="Ваша щоденна афірмація"
          textContent='"Кожного дня я стаю все сильнишим та впевненим на своєму шляху."'
          icon={<StarRingIcon />}
        />
        <DailyCard
          variant="secondary"
          title="Порада дня"
          textContent='"Почніть свій день із постановки однієї маленької досяжної цілі — це створює імпульс для більших успіхів!"'
          icon={<AstronomyIcon />}
        />
      </div>
      <SectionCard title="Попередні афірмації та поради" subtitle="У тебе ще не має попередніх афірмацій та порад." />
    </div>
  )
}
