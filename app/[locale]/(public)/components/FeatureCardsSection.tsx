import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { SectionCard } from '@/ds/components/SectionCard'
import { Statuses } from '@/types/status.types'

export function FeatureCardsSection() {
  const t = useTranslations('pages.Landing')
  const interactivityDecoration = (
    <Image
      aria-hidden
      src="/services/icons/molecular.svg"
      alt=""
      width={176}
      height={176}
      className="absolute bottom-[-20px] left-[-30px] h-44 w-44 opacity-30"
      priority={false}
    />
  )
  const supportDecoration = (
    <Image
      aria-hidden
      src="/services/icons/support.svg"
      alt=""
      width={176}
      height={176}
      className="absolute bottom-[-40px] right-2 h-44 w-44 opacity-30"
      priority={false}
    />
  )
  const aiDecoration = (
    <Image
      aria-hidden
      src="/services/icons/care.svg"
      alt=""
      width={176}
      height={176}
      className="absolute right-[-30px] top-[-30px] h-44 w-44 opacity-30"
      priority={false}
    />
  )

  return (
    <section className="mb-12 w-full">
      <div className="container-max-width mx-auto grid grid-cols-1 gap-default px-4 tablet:px-6 md:grid-cols-3 md:px-8 lg:px-10">
        <SectionCard
          type={Statuses.note}
          title={t('Features.interactivity.title')}
          subtitle={t('Features.interactivity.subtitle')}
          titleClassName="text-title light-shadow text-textcolor-primary"
          decoration={interactivityDecoration}
        />
        <SectionCard
          type={Statuses.info}
          title={t('Features.support.title')}
          subtitle={t('Features.support.subtitle')}
          titleClassName="text-title light-shadow text-textcolor-primary"
          decoration={supportDecoration}
        />
        <SectionCard
          type="success"
          title={t('Features.ai.title')}
          subtitle={t('Features.ai.subtitle')}
          titleClassName="text-title light-shadow text-textcolor-primary"
          decoration={aiDecoration}
        />
      </div>
    </section>
  )
}
