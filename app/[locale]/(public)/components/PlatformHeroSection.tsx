import { ArrowUpRight, BarChart3, Building2, ShieldCheck, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/navigation'

export function PlatformHeroSection() {
  const t = useTranslations('pages.Landing.Platform')
  const capabilities = [
    { key: 'organization', Icon: Users, title: t('capabilities.organization.title'), description: t('capabilities.organization.description') },
    { key: 'analytics', Icon: BarChart3, title: t('capabilities.analytics.title'), description: t('capabilities.analytics.description') },
    { key: 'access', Icon: ShieldCheck, title: t('capabilities.access.title'), description: t('capabilities.access.description') },
  ] as const

  return (
    <section aria-labelledby="platform-heading" className="border-b border-[var(--outline-secondary)] bg-white">
      <div className="container-max-width mx-auto grid gap-8 px-4 py-10 tablet:px-6 tablet:py-14 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] md:gap-12 md:px-8 md:py-20 lg:px-10">
        <div className="flex flex-col items-start justify-center gap-5">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-textcolor-secondary">
            <Building2 aria-hidden size={18} />
            {t('eyebrow')}
          </p>
          <h1 id="platform-heading" className="landing-h1 max-w-[44rem]">{t('title')}</h1>
          <p className="max-w-2xl text-base leading-relaxed text-textcolor-secondary tablet:text-lg">{t('subtitle')}</p>
          <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href={Routes.CONTACTS} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-6 py-3 text-center text-sm font-semibold text-white hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2">
              {t('primaryCta')}
              <ArrowUpRight aria-hidden size={17} />
            </Link>
            <Link href={Routes.SERVICES + '#b2b'} className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--outline-secondary)] px-6 py-3 text-center text-sm font-semibold text-textcolor-primary hover:border-[var(--primary)] focus-visible:outline-2 focus-visible:outline-offset-2">
              {t('secondaryCta')}
            </Link>
          </div>
        </div>
        <div className="rounded-3xl border border-[var(--outline-secondary)] bg-background-muted p-5 tablet:p-7">
          <p className="text-sm font-semibold text-textcolor-secondary">{t('capabilitiesHeading')}</p>
          <ul className="mt-5 divide-y divide-[var(--outline-secondary)]">
            {capabilities.map(({ key, Icon, title, description }) => (
              <li key={key} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
                <Icon aria-hidden className="mt-0.5 shrink-0 text-textcolor-primary" size={22} strokeWidth={1.6} />
                <div>
                  <h2 className="text-base font-semibold text-textcolor-primary">{title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-textcolor-secondary">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
