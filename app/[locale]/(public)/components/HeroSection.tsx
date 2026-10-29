'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/navigation'

import { WaterSurface, type WaterSurfaceHandle } from './water/WaterSurface'
import { BreathingPreview } from './BreathingPreview'
import { landingContainer, landingH2, landingPrimaryCta, landingSecondaryCta } from './landingStyles'

const LAGOON = { deep: '#7cc3d2', mid: '#dcf2f5', light: '#ffffff' }

export function HeroSection({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const t = useTranslations('pages.Landing')
  const water = useRef<WaterSurfaceHandle>(null)
  const layer = useRef<HTMLDivElement>(null)
  const [source, setSource] = useState({ x: 0.72, y: 0.45 })
  useEffect(() => {
    const locate = () => {
      const area = layer.current?.getBoundingClientRect()
      const orb = layer.current?.parentElement?.querySelector('[data-breath-orb]')?.getBoundingClientRect()
      if (!area?.width || !area.height || !orb) return
      setSource({
        x: (orb.left + orb.width / 2 - area.left) / area.width,
        y: (orb.top + orb.height / 2 - area.top) / area.height,
      })
    }
    locate()
    window.addEventListener('resize', locate)
    return () => window.removeEventListener('resize', locate)
  }, [])
  const onBreath = useCallback((orb: DOMRect) => {
    const area = layer.current?.getBoundingClientRect()
    if (!area?.width || !area.height) return
    water.current?.drop(
      (orb.left + orb.width / 2 - area.left) / area.width,
      (orb.top + orb.height / 2 - area.top) / area.height,
      1
    )
  }, [])

  return (
    <section
      id="b2c-experience"
      aria-labelledby="b2c-experience-heading"
      className="relative isolate scroll-mt-5 overflow-hidden"
    >
      <div ref={layer} className="pointer-events-none absolute inset-0 -z-10">
        <WaterSurface ref={water} colors={LAGOON} source={source} every={6} className="h-full w-full" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.6)_0%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0)_75%)]" />
      </div>
      <div
        className={`${landingContainer} grid grid-cols-1 items-center gap-8 md:min-h-[620px] md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-12`}
      >
        <div className="flex flex-col items-start gap-5">
          <h2 id="b2c-experience-heading" className={landingH2}>
            {isAuthenticated ? t('Hero.returnTitle') : t('Hero.title')}
          </h2>
          <p className="max-w-xl text-base leading-[1.75] text-[#3f5468] tablet:text-lg">
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
        <BreathingPreview isAuthenticated={isAuthenticated} onBreath={onBreath} />
      </div>
    </section>
  )
}
