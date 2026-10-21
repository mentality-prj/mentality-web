'use client'

import { Activity, ArrowUpRight, BookOpenText, Wind } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Routes } from '@/constants/routes'
import { rememberLandingIntent } from '@/helpers/landingIntent'
import { Link } from '@/i18n/navigation'

const choices = [
  { key: 'mood', icon: Activity, href: Routes.MOODTRACKER, titleKey: 'Next.mood.title', descriptionKey: 'Next.mood.description' },
  { key: 'diary', icon: BookOpenText, href: Routes.DIARY, titleKey: 'Next.diary.title', descriptionKey: 'Next.diary.description' },
  { key: 'practice', icon: Wind, href: Routes.GUIDE + '/breathing', titleKey: 'Next.practice.title', descriptionKey: 'Next.practice.description' },
] as const

export function FeatureCardsSection({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const t = useTranslations('pages.Landing')

  return (
    <section aria-labelledby="next-action-heading" className="container-max-width mx-auto px-4 py-10 tablet:px-6 tablet:py-14 md:px-8 lg:px-10">
      <div className="mb-6">
        <h2 id="next-action-heading" className="text-2xl font-semibold text-textcolor-primary tablet:text-3xl">
          {t('Next.heading')}
        </h2>
        <p className="mt-2 text-sm text-textcolor-secondary">{t('Next.subtitle')}</p>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {choices.map(({ key, icon: Icon, href, titleKey, descriptionKey }) => {
          const target = isAuthenticated ? href : key === 'practice' ? '#try-now' : Routes.AUTH
          return (
            <Link
              key={key}
              href={target}
              onClick={() => {
                if (!isAuthenticated && (key === 'mood' || key === 'diary')) rememberLandingIntent(key)
              }}
              className="group flex min-h-36 flex-col rounded-2xl border border-[var(--outline-secondary)] bg-white p-5 transition-colors hover:border-[var(--primary)] focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <div className="mb-4 flex items-center justify-between">
                <Icon aria-hidden size={24} className="text-textcolor-primary" strokeWidth={1.6} />
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
      <div className="mt-7 flex flex-col items-start justify-between gap-4 border-t border-[var(--outline-secondary)] pt-6 sm:flex-row sm:items-center">
        <p className="max-w-lg text-sm text-textcolor-secondary">{t('Next.closing')}</p>
        <Link
          href={isAuthenticated ? Routes.MYDAY : Routes.AUTH}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white sm:w-auto"
        >
          {isAuthenticated ? t('Hero.returnCta') : t('Next.signup')}
        </Link>
      </div>
    </section>
  )
}
