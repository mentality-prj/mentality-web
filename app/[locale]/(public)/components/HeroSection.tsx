import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/navigation'

import { BreathingPreview } from './BreathingPreview'

export function HeroSection({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const t = useTranslations('pages.Landing')

  return (
    <section aria-labelledby="landing-heading" className="border-b border-[var(--outline-secondary)] bg-white">
      <div className="container-max-width mx-auto grid grid-cols-1 items-center gap-8 px-4 py-8 tablet:px-6 tablet:py-12 md:grid-cols-2 md:gap-12 md:px-8 md:py-16 lg:px-10">
        <div className="flex flex-col items-start gap-5">
          <h1 id="landing-heading" className="landing-h1 max-w-[680px]">
            {isAuthenticated ? t('Hero.returnTitle') : t('Hero.title')}
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-textcolor-secondary tablet:text-lg">
            {isAuthenticated ? t('Hero.returnSubtitle') : t('Hero.subtitle')}
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <a
              href="#try-now"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-6 py-3 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {t('Hero.tryCta')}
              <ArrowDown aria-hidden size={17} />
            </a>
            <Link
              href={isAuthenticated ? Routes.MYDAY : Routes.AUTH}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[var(--outline-secondary)] px-6 py-3 text-center text-sm font-semibold text-textcolor-primary hover:border-[var(--primary)] focus-visible:outline-2 focus-visible:outline-offset-2"
            >
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
