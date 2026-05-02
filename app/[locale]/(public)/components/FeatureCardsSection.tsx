import { FlaskConical, Lightbulb, Radar } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { SectionCard } from '@/ds/components/SectionCard'
import { Statuses } from '@/types/status.types'

export function FeatureCardsSection() {
  const t = useTranslations('pages.Landing')
  const interactivityDecoration = (
    <Radar aria-hidden className="absolute bottom-[-14px] left-[-16px] h-32 w-32 text-white/35" strokeWidth={1.6} />
  )
  const supportDecoration = (
    <FlaskConical aria-hidden className="absolute bottom-[-18px] right-2 h-32 w-32 text-white/35" strokeWidth={1.6} />
  )
  const aiDecoration = (
    <Lightbulb aria-hidden className="absolute right-[-12px] top-[-12px] h-32 w-32 text-white/35" strokeWidth={1.6} />
  )

  return (
    <section className="mb-12 w-full">
      <div className="container-max-width mx-auto grid grid-cols-1 gap-default px-4 tablet:px-6 md:grid-cols-3 md:px-8 lg:px-10">
        <SectionCard
          type={Statuses.note}
          title={t('Features.interactivity.title')}
          subtitle={t('Features.interactivity.subtitle')}
          titleClassName="text-title shadow-light text-textcolor-primary"
          decoration={interactivityDecoration}
        />
        <SectionCard
          type={Statuses.info}
          title={t('Features.support.title')}
          subtitle={t('Features.support.subtitle')}
          titleClassName="text-title shadow-light text-textcolor-primary"
          decoration={supportDecoration}
        />
        <SectionCard
          type="success"
          title={t('Features.ai.title')}
          subtitle={t('Features.ai.subtitle')}
          titleClassName="text-title shadow-light text-textcolor-primary"
          decoration={aiDecoration}
        />
      </div>
    </section>
  )
}
