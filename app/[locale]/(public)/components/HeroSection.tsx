'use client'
import { useLayoutEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'

import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/navigation'
import { Button } from '@/ui/button'

export function HeroSection() {
  const t = useTranslations('pages.Landing')

  const heroRef = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    const heroEl = heroRef.current
    const logoEl = document.querySelector<HTMLElement>('[data-landing-logo="true"]')
    if (!heroEl || !logoEl) return
    const DECORATIVE_INSET_RATIO = 0.28

    const updateGradientAnchor = () => {
      const heroRect = heroEl.getBoundingClientRect()
      const logoRect = logoEl.getBoundingClientRect()
      const pseudoLeft = heroRect.left - heroRect.width * DECORATIVE_INSET_RATIO
      const anchorX = logoRect.left + logoRect.width / 2 - pseudoLeft
      heroEl.style.setProperty('--hero-gradient-x', `${anchorX}px`)
      const pseudoTop = heroRect.top - heroRect.height * DECORATIVE_INSET_RATIO
      const anchorY = Math.max(logoRect.top + logoRect.height / 2 - pseudoTop, heroRect.height * 0.18)
      heroEl.style.setProperty('--hero-gradient-y', `${anchorY}px`)
      heroEl.dataset.heroRingsReady = 'true'
    }

    updateGradientAnchor()
    window.addEventListener('resize', updateGradientAnchor)

    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateGradientAnchor) : null
    observer?.observe(logoEl)

    return () => {
      window.removeEventListener('resize', updateGradientAnchor)
      observer?.disconnect()
    }
  }, [])

  return (
    <section
      ref={heroRef}
      data-hero-rings-ready="false"
      className="hero-zen mb-8 w-full py-8 tablet:mb-10 tablet:py-10 sm:py-12 md:py-16"
    >
      <div className="container-max-width mx-auto px-4 tablet:px-6 md:px-8">
        <div className="grid grid-cols-1 items-center gap-default md:grid-cols-2 md:gap-x-md">
          <div className="flex max-w-[720px] flex-col gap-default md:max-lg:contents">
            <h1 className="landing-h1 md:max-lg:col-span-2">{t('Hero.title')}</h1>
            <p className="text-textcolor-secondary">{t('Hero.subtitle')}</p>
          </div>
          <div className="flex justify-center tablet:justify-end md:row-span-2 md:max-lg:justify-start">
            <div
              className="w-full max-w-[420px] rounded-[24px] border border-[var(--outline-secondary)] bg-white p-5 shadow-sm tablet:p-7"
            >
              <h2 className="text-title text-xl leading-snug">{t('Hero.path.heading')}</h2>
              <ol className="mt-5 flex flex-col gap-4">
                {(['mood', 'diary', 'support'] as const).map((step, index) => (
                  <li key={step} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background-muted text-sm font-semibold text-textcolor-primary"
                    >
                      {index + 1}
                    </span>
                    <span className="pt-1 text-base leading-relaxed text-textcolor-secondary">
                      {t(`Hero.path.${step}`)}
                    </span>
                  </li>
                ))}
              </ol>
              <p
                className="mt-5 border-t border-[var(--outline-secondary)] pt-4 text-sm leading-relaxed text-textcolor-secondary"
              >
                {t('Hero.path.note')}
              </p>
            </div>
          </div>
          <div className="mx-auto flex justify-start tablet:mx-0">
            <Button asChild variant="volume" size="large">
              <Link href={Routes.AUTH}>{t('Hero.cta')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
