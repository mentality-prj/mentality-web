'use client'

import { Activity, ArrowUpRight, BookOpenText, Wind } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/navigation'

import { landingContainer, landingH2, landingPrimaryCta } from './landingStyles'

const choices = [
  {
    key: 'mood',
    icon: Activity,
    href: Routes.MOODTRACKER,
    titleKey: 'Next.mood.title',
    descriptionKey: 'Next.mood.description',
    theme: 'border-[#bce5db] bg-[linear-gradient(145deg,#f0fdf8,#ddf7ed)]',
    iconTheme: 'bg-[#d0f5e7] text-[#16806c]',
  },
  {
    key: 'diary',
    icon: BookOpenText,
    href: Routes.DIARY,
    titleKey: 'Next.diary.title',
    descriptionKey: 'Next.diary.description',
    theme: 'border-[#c8e4f6] bg-[linear-gradient(145deg,#f0faff,#e1f2ff)]',
    iconTheme: 'bg-[#d5ecfc] text-[#367fbd]',
  },
  {
    key: 'practice',
    icon: Wind,
    href: Routes.GUIDE + '/breathing',
    titleKey: 'Next.practice.title',
    descriptionKey: 'Next.practice.description',
    theme: 'border-[#e1d1f7] bg-[linear-gradient(145deg,#f9f2ff,#eee3ff)]',
    iconTheme: 'bg-[#e8dafb] text-[#8050b5]',
  },
] as const

export function FeatureCardsSection({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const t = useTranslations('pages.Landing')

  return (
    <section aria-labelledby="next-action-heading" className="bg-white">
      <div className={landingContainer}>
        <div className="mb-8">
          <h2 id="next-action-heading" className={landingH2}>
            {t('Next.heading')}
          </h2>
          <p className="mt-2 text-sm text-textcolor-secondary">{t('Next.subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {choices.map(({ key, icon: Icon, href, titleKey, descriptionKey, theme, iconTheme }) => {
            const target = isAuthenticated ? href : key === 'practice' ? '#try-now' : Routes.AUTH
            return (
              <Link
                key={key}
                href={target}
                className={`group flex min-h-36 flex-col rounded-[24px] border p-5 transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 ${theme}`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconTheme}`}>
                    <Icon aria-hidden size={24} strokeWidth={1.6} />
                  </span>
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
        <div className="mt-6 rounded-2xl border border-[#dce7f5] bg-white/85 px-5 py-4">
          <h3 className="text-base font-semibold text-[#323653]">{t('Next.progressTitle')}</h3>
          <p className="mt-1 text-sm leading-relaxed text-[#5c627a]">{t('Next.progressDescription')}</p>
          {isAuthenticated && (
            <Link
              href={Routes.MYPROGRESS}
              className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {t('Next.progressCta')}
            </Link>
          )}
        </div>
        <div className="mt-7 flex flex-col items-start justify-between gap-4 border-t border-[#ece6f6] pt-6 sm:flex-row sm:items-center">
          <p className="max-w-lg text-sm text-textcolor-secondary">{t('Next.closing')}</p>
          <Link href={isAuthenticated ? Routes.MYDAY : Routes.AUTH} className={`${landingPrimaryCta} w-full sm:w-auto`}>
            {isAuthenticated ? t('Hero.returnCta') : t('Next.signup')}
          </Link>
        </div>
      </div>
    </section>
  )
}
