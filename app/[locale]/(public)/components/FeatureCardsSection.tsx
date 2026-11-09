'use client'

import { ArrowUpRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/navigation'

import { DoodleIcon } from './doodle/DoodleIcon'
import { landingContainer, landingH2, landingPrimaryCta } from './landingStyles'

const choices = [
  {
    key: 'mood',
    glyph: 'mood',
    tone: 'mint',
    decor: '-right-10 top-16 rotate-[-14deg]',
    href: Routes.MOODTRACKER,
    titleKey: 'Next.mood.title',
    descriptionKey: 'Next.mood.description',
    theme: 'border-[#bce5db] bg-[linear-gradient(145deg,#f0fdf8,#ddf7ed)]',
  },
  {
    key: 'diary',
    glyph: 'journal',
    tone: 'sky',
    decor: 'bottom-4 right-4 rotate-[11deg]',
    href: Routes.DIARY,
    titleKey: 'Next.diary.title',
    descriptionKey: 'Next.diary.description',
    theme: 'border-[#c8e4f6] bg-[linear-gradient(145deg,#f0faff,#e1f2ff)]',
  },
  {
    key: 'practice',
    glyph: 'meditation',
    tone: 'lilac',
    decor: 'bottom-4 right-4 rotate-[-6deg]',
    href: Routes.GUIDE + '/breathing',
    titleKey: 'Next.practice.title',
    descriptionKey: 'Next.practice.description',
    theme: 'border-[#e1d1f7] bg-[linear-gradient(145deg,#f9f2ff,#eee3ff)]',
  },
] as const

export function FeatureCardsSection({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const t = useTranslations('pages.Landing')

  return (
    <section aria-labelledby="next-action-heading" className="bg-white">
      <div className={`${landingContainer} pb-10 md:pb-14`}>
        <div className="mb-8">
          <h2 id="next-action-heading" className={landingH2}>
            {t('Next.heading')}
          </h2>
          <p className="mt-2 text-sm text-textcolor-secondary">{t('Next.subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {choices.map(({ key, glyph, tone, decor, href, titleKey, descriptionKey, theme }) => {
            const target = isAuthenticated ? href : key === 'practice' ? '#try-now' : Routes.AUTH
            return (
              <Link
                key={key}
                href={target}
                className={`group relative isolate flex min-h-36 flex-col overflow-hidden rounded-[24px] border p-5 transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 ${theme}`}
              >
                <DoodleIcon
                  name={glyph}
                  tone={tone}
                  size={136}
                  plain
                  className={`pointer-events-none absolute -z-10 opacity-30 transition-transform duration-700 group-hover:scale-105 ${decor}`}
                />
                <div className="mb-4 flex items-center justify-between">
                  <DoodleIcon
                    name={glyph}
                    tone="paper"
                    size={88}
                    className="shadow-[0_8px_24px_-12px_rgba(60,50,110,0.35)]"
                  />
                  <ArrowUpRight aria-hidden size={18} className="text-textcolor-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-textcolor-primary">{t(titleKey)}</h3>
                <p className="mt-1 text-sm leading-relaxed text-textcolor-secondary">{t(descriptionKey)}</p>
                <span className="mt-auto pt-4 text-sm font-medium text-primary">
                  {t(!isAuthenticated && key !== 'practice' ? 'Next.afterLogin' : 'Next.open')}
                </span>
              </Link>
            )
          })}
        </div>
        <div className="mt-6 flex justify-end">
          <Link href={isAuthenticated ? Routes.MYDAY : Routes.AUTH} className={`${landingPrimaryCta} w-full sm:w-auto`}>
            {isAuthenticated ? t('Hero.returnCta') : t('Next.signup')}
          </Link>
        </div>
      </div>
    </section>
  )
}
