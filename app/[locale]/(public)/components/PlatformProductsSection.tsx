import { Activity, ArrowUpRight, BarChart3, BookOpenText, BriefcaseBusiness, FlaskConical, ShieldCheck } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/navigation'

export function PlatformProductsSection() {
  const t = useTranslations('pages.Landing.Products')

  const products = [
    {
      key: 'b2b',
      Icon: BriefcaseBusiness,
      label: t('b2b.label'),
      audience: t('b2b.audience'),
      title: t('b2b.title'),
      description: t('b2b.description'),
      cta: t('b2b.cta'),
      href: Routes.SERVICES + '#b2b',
      className: 'md:col-span-2 lg:col-span-2',
      features: [
        { key: 'teams', Icon: ShieldCheck, text: t('b2b.features.teams') },
        { key: 'analytics', Icon: BarChart3, text: t('b2b.features.analytics') },
        { key: 'decisions', Icon: BriefcaseBusiness, text: t('b2b.features.decisions') },
      ],
    },
    {
      key: 'b2c',
      Icon: Activity,
      label: t('b2c.label'),
      audience: '',
      title: t('b2c.title'),
      description: t('b2c.description'),
      cta: t('b2c.cta'),
      href: '#b2c-experience',
      className: '',
      features: [
        { key: 'checkins', Icon: Activity, text: t('b2c.features.checkins') },
        { key: 'diary', Icon: BookOpenText, text: t('b2c.features.diary') },
        { key: 'exercises', Icon: Activity, text: t('b2c.features.exercises') },
      ],
    },
    {
      key: 'rd',
      Icon: FlaskConical,
      label: t('rd.label'),
      audience: '',
      title: t('rd.title'),
      description: t('rd.description'),
      cta: t('rd.cta'),
      href: Routes.SERVICES + '#rd',
      className: '',
      features: [
        { key: 'cohorts', Icon: FlaskConical, text: t('rd.features.cohorts') },
        { key: 'validation', Icon: BarChart3, text: t('rd.features.validation') },
        { key: 'reports', Icon: BookOpenText, text: t('rd.features.reports') },
      ],
    },
  ] as const

  return (
    <section id="products" aria-labelledby="products-heading" className="bg-white">
      <div className="container-max-width mx-auto px-4 py-10 tablet:px-6 tablet:py-14 md:px-8 md:py-16 lg:px-10">
        <div className="mb-7 max-w-2xl">
          <h2 id="products-heading" className="text-2xl font-semibold text-textcolor-primary tablet:text-3xl">{t('heading')}</h2>
          <p className="mt-2 text-base text-textcolor-secondary">{t('description')}</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {products.map(({ key, Icon, label, audience, title, description, features, href, cta, className }) => (
            <article key={key} className={`flex h-full flex-col rounded-3xl border border-[var(--outline-secondary)] bg-white p-5 tablet:p-7 ${className}`}>
              <div className="mb-5 flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-sm font-semibold text-textcolor-secondary">
                  <Icon aria-hidden size={20} strokeWidth={1.6} />
                  {label}
                </span>
                {audience && <span className="text-xs font-medium text-textcolor-secondary">{audience}</span>}
              </div>
              <h3 className="text-xl font-semibold text-textcolor-primary">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-textcolor-secondary">{description}</p>
              <ul className="my-6 space-y-3">
                {features.map(({ key: featureKey, Icon: FeatureIcon, text }) => (
                  <li key={featureKey} className="flex items-start gap-3 text-sm leading-relaxed text-textcolor-primary">
                    <FeatureIcon aria-hidden size={18} strokeWidth={1.5} className="mt-0.5 shrink-0" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
              <Link href={href} className="mt-auto inline-flex min-h-11 w-fit items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2">
                {cta}
                <ArrowUpRight aria-hidden size={18} />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
