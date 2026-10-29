import { ArrowUpRight, Building2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'

import { BUSINESS_CONTACT_HREF } from './landingContactLinks'

/** Public B2B entry point below the personal product journey, not a surveillance-first Hero. */
export function BusinessInvitationSection() {
  const t = useTranslations('pages.Landing.BusinessInvitation')

  return (
    <section
      aria-labelledby="business-invitation-heading"
      className="bg-[linear-gradient(110deg,#e9f4ff,#eff0ff_52%,#fff0f6)]"
    >
      <div className="container-max-width mx-auto px-4 py-10 tablet:px-6 tablet:py-14 md:px-8 lg:px-10">
        <div className="flex flex-col items-start gap-5 rounded-[28px] border border-[#d7d9f0] bg-white/70 p-6 tablet:p-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-xs font-semibold text-[#586aa0]">
              <Building2 aria-hidden size={17} />
              {t('eyebrow')}
            </p>
            <h2
              id="business-invitation-heading"
              className="mt-3 text-2xl font-semibold leading-tight text-[#323653] tablet:text-3xl"
            >
              {t('title')}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#606681] tablet:text-base">{t('description')}</p>
          </div>
          <Link
            href={BUSINESS_CONTACT_HREF}
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#615bad] px-6 py-3 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {t('cta')}
            <ArrowUpRight aria-hidden size={17} />
          </Link>
        </div>
      </div>
    </section>
  )
}
