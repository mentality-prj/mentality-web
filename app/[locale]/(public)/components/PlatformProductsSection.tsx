import { Activity, ArrowUpRight, BarChart3, BookOpenText, BriefcaseBusiness, FlaskConical, ShieldCheck, Wind } from 'lucide-react'
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
      className: 'md:col-span-2 lg:col-span-2 bg-[linear-gradient(135deg,#20336e_0%,#3455a3_65%,#5860ad_100%)] border-[#4a6bb9]/40 text-white shadow-[0_24px_55px_rgba(43,64,134,0.18)]',
      labelClass: 'border-white/25 bg-white/15 text-white/95',
      bodyClass: 'text-white/90',
      itemClass: 'text-white/95',
      iconClass: 'bg-white/20 text-[#b5f1ff]',
      ctaClass: 'text-[#c1f4ff]',
      glowClass: 'bg-[#64d8ff]/45',
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
      className: 'bg-[linear-gradient(146deg,#dcf8ed_0%,#bcebdc_100%)] border-[#b0dfcd] text-[#19453f] shadow-[0_20px_45px_rgba(37,132,109,0.1)]',
      labelClass: 'border-emerald-700/15 bg-white/55 text-[#23584f]',
      bodyClass: 'text-[#375e58]',
      itemClass: 'text-[#194e45]',
      iconClass: 'bg-white/55 text-[#17816e]',
      ctaClass: 'text-[#087a64]',
      glowClass: 'bg-[#65e5b9]/50',
      features: [
        { key: 'checkins', Icon: Activity, text: t('b2c.features.checkins') },
        { key: 'diary', Icon: BookOpenText, text: t('b2c.features.diary') },
        { key: 'exercises', Icon: Wind, text: t('b2c.features.exercises') },
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
      className: 'bg-[linear-gradient(146deg,#f0e5ff_0%,#e2d6fc_100%)] border-[#d8c7f2] text-[#3f275b] shadow-[0_20px_45px_rgba(115,70,173,0.11)]',
      labelClass: 'border-violet-700/15 bg-white/55 text-[#654088]',
      bodyClass: 'text-[#674f7b]',
      itemClass: 'text-[#4c3566]',
      iconClass: 'bg-white/55 text-[#7952a9]',
      ctaClass: 'text-[#6940a5]',
      glowClass: 'bg-[#b78bff]/50',
      features: [
        { key: 'cohorts', Icon: FlaskConical, text: t('rd.features.cohorts') },
        { key: 'validation', Icon: BarChart3, text: t('rd.features.validation') },
        { key: 'reports', Icon: BookOpenText, text: t('rd.features.reports') },
      ],
    },
  ] as const

  return (
    <section
      id="products"
      aria-labelledby="products-heading"
      className="bg-[linear-gradient(180deg,#f6fbff_0%,#ffffff_55%,#fdf9ff_100%)]"
    >
      <div className="container-max-width mx-auto px-4 py-12 tablet:px-6 tablet:py-16 md:px-8 md:py-20 lg:px-10">
        <div className="mb-8 max-w-2xl">
          <h2 id="products-heading" className="text-[1.75rem] font-semibold leading-tight text-[#203056] tablet:text-[2.35rem]">
            {t('heading')}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[#5e6782]">{t('description')}</p>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {products.map(({
            key, Icon, label, audience, title, description, features, href, cta, className,
            labelClass, bodyClass, itemClass, iconClass, ctaClass, glowClass,
          }) => (
            <article
              key={key}
              className={`group relative isolate flex h-full min-h-[350px] flex-col overflow-hidden rounded-[30px] border p-6 transition-transform duration-300 hover:-translate-y-1 tablet:p-7 ${className}`}
            >
              <div aria-hidden="true" className={`pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full opacity-75 blur-[62px] ${glowClass}`} />
              <Icon
                aria-hidden
                strokeWidth={1}
                className="pointer-events-none absolute -right-7 top-12 h-36 w-36 rotate-[-14deg] opacity-[0.12] tablet:h-44 tablet:w-44"
              />
              <div className="relative mb-7 flex flex-wrap items-center justify-between gap-3">
                <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${labelClass}`}>
                  <Icon aria-hidden size={17} strokeWidth={1.7} />
                  {label}
                </span>
                {audience && <span className="text-xs font-medium text-white/80">{audience}</span>}
              </div>

              <div className="relative">
                <h3 className="max-w-md text-[1.5rem] font-semibold leading-tight tracking-tight">{title}</h3>
                <p className={`mt-3 max-w-lg text-sm leading-[1.7] ${bodyClass}`}>{description}</p>
              </div>

              <ul className="relative my-6 space-y-3">
                {features.map(({ key: featureKey, Icon: FeatureIcon, text }) => (
                  <li key={featureKey} className={`flex items-start gap-3 text-sm leading-relaxed ${itemClass}`}>
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
                      <FeatureIcon aria-hidden size={18} strokeWidth={1.7} />
                    </span>
                    <span className="pt-1">{text}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={href}
                className={`relative mt-auto inline-flex min-h-11 w-fit items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 ${ctaClass}`}
              >
                {cta}
                <ArrowUpRight aria-hidden size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
