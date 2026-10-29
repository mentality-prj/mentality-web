import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/navigation'

import { BreathingPreview } from './BreathingPreview'
import { landingContainer, landingH2, landingPrimaryCta, landingSecondaryCta } from './landingStyles'

export function HeroSection({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const t = useTranslations('pages.Landing')

  return (
    <section
      id="b2c-experience"
      aria-labelledby="b2c-experience-heading"
      className="scroll-mt-5 border-t border-[#c6e7f0]/70 bg-[linear-gradient(130deg,#dffaff_0%,#e8f6ff_48%,#eee4ff_100%)]"
    >
      <div className={`${landingContainer} grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12`}>
        <div className="flex flex-col items-start gap-5">
          <h2 id="b2c-experience-heading" className={landingH2}>
            {isAuthenticated ? t('Hero.returnTitle') : t('Hero.title')}
          </h2>
          <p className="max-w-xl text-base leading-[1.75] text-[#575570] tablet:text-lg">
            {isAuthenticated ? t('Hero.returnSubtitle') : t('Hero.subtitle')}
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <a href="#try-now" className={landingPrimaryCta}>
              {t('Hero.tryCta')}
              <ArrowDown aria-hidden size={17} />
            </a>
            <Link href={isAuthenticated ? Routes.MYDAY : Routes.AUTH} className={landingSecondaryCta}>
              {isAuthenticated ? t('Hero.returnCta') : t('Hero.cta')}
              <ArrowUpRight aria-hidden size={17} />
            </Link>
          </div>
        </div>
        <BreathingPreview isAuthenticated={isAuthenticated} />
      </div>
    </section>
  )
}
