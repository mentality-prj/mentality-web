import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/navigation'

import { DoodleIcon } from './doodle/DoodleIcon'
import { BUSINESS_CONTACT_HREF } from './landingContactLinks'
import { landingPrimaryCta, landingSecondaryCta } from './landingStyles'
import { MoodResonance } from './MoodResonance'

/**
 * Dzvin is introduced through the person's day, not through enterprise reporting.
 * This is a decorative product vignette — it contains no fabricated user data.
 */
export function PlatformHeroSection({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const t = useTranslations('pages.Landing.Platform')

  return (
    <section aria-labelledby="platform-heading" data-hero-rings-ready="false" className="hero-zen isolate">
      <MoodResonance className="container-max-width relative mx-auto grid items-center gap-9 px-4 pb-12 pt-10 tablet:px-6 tablet:pb-16 tablet:pt-14 md:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] md:gap-14 md:px-8 md:py-20 lg:px-10">
        <div className="flex flex-col items-start gap-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 py-1.5 pl-1.5 pr-4 text-xs font-semibold tracking-wide text-[#795179] shadow-sm backdrop-blur-sm">
            <DoodleIcon name="heart" tone="rose" size={28} />
            {t('eyebrow')}
          </span>
          <h1 id="platform-heading" className="landing-h1 max-w-[43rem] text-[#302a4f]">
            {t('title')}
          </h1>
          <p className="max-w-[38rem] text-base leading-[1.75] text-[#575570] tablet:text-lg">{t('subtitle')}</p>
          <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href={isAuthenticated ? Routes.MYDAY : '#b2c-experience'} className={landingPrimaryCta}>
              {isAuthenticated ? t('returnCta') : t('primaryCta')}
              <ArrowDownRight aria-hidden size={18} />
            </Link>
            <a href="#products" className={landingSecondaryCta}>
              {t('secondaryCta')}
            </a>
          </div>
          <Link
            href={BUSINESS_CONTACT_HREF}
            className="mt-1 inline-flex min-h-10 items-center gap-2 text-sm font-medium text-[#5e5580] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {t('businessCta')}
            <ArrowUpRight aria-hidden size={16} />
          </Link>
        </div>
      </MoodResonance>
    </section>
  )
}
