'use client'
import { useLayoutEffect, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

import AvatarStack from '@/components/shared/AvatarStack'
import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/navigation'
import { Button } from '@/ui/button'

export function HeroSection() {
  const t = useTranslations('pages.Landing')

  const avatars = ['/avatars/avatar1.png', '/avatars/avatar2.png', '/avatars/avatar3.png']
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
    <section ref={heroRef} data-hero-rings-ready="false" className="hero-zen mb-10 w-full py-16">
      <div className="container-max-width mx-auto px-8">
        <div className="grid grid-cols-1 items-center gap-md md:grid-cols-2">
          <div className="flex max-w-[720px] flex-col gap-default">
            <h1 className="landing-h1">{t('Hero.title')}</h1>
            <p className="text-textcolor-secondary">{t('Hero.subtitle')}</p>
            <div>
              <Button asChild variant="volume" size="large">
                <Link href={Routes.AUTH}>{t('Hero.cta')}</Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="w-[375px] rounded-[14px] bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between gap-sm">
                <h3 className="text-title line-clamp-2 w-full whitespace-pre-line pr-2 text-base leading-[120%]">
                  {t('Hero.testimonial.title')}
                </h3>
                <button
                  type="button"
                  aria-label={t('Hero.testimonial.primary')}
                  className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-[var(--outline-secondary)]"
                >
                  <ArrowUpRight size={24} className="text-[var(--text-muted)]" />
                </button>
              </div>
              <div className="mt-4 border-t border-[var(--outline-secondary)]" />
              <div className="mt-4 flex items-center justify-between">
                <AvatarStack images={avatars} />
                <span className="text-[26px] font-bold leading-[150%] text-[var(--text-muted)]">
                  {t('Hero.testimonial.metric')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
