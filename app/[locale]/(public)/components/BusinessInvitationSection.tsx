import { ArrowUpRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'

import { DoodleIcon } from './doodle/DoodleIcon'
import { BUSINESS_CONTACT_HREF } from './landingContactLinks'
import { landingContainer, landingH2, landingPrimaryCta } from './landingStyles'

/** Public B2B entry point below the personal product journey, not a surveillance-first Hero. */
export function BusinessInvitationSection() {
  const t = useTranslations('pages.Landing.BusinessInvitation')

  return (
    <section aria-labelledby="business-invitation-heading" className="bg-[#f8f6ff]">
      <div className={landingContainer}>
        <div className="flex flex-col items-start gap-5 rounded-[28px] border border-[#e4def3] bg-white p-6 tablet:p-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-xs font-semibold text-[#586aa0]">
              <DoodleIcon name="building" tone="sky" size={40} />
              {t('eyebrow')}
            </p>
            <h2 id="business-invitation-heading" className={`mt-3 ${landingH2}`}>
              {t('title')}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#606681] tablet:text-base">{t('description')}</p>
          </div>
          <Link href={BUSINESS_CONTACT_HREF} className={`${landingPrimaryCta} shrink-0`}>
            {t('cta')}
            <ArrowUpRight aria-hidden size={17} />
          </Link>
        </div>
      </div>
    </section>
  )
}
