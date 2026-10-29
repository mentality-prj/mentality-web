import { ArrowUpRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/navigation'

import { DoodleIcon, type DoodleName, type DoodleTone } from './doodle/DoodleIcon'
import { BUSINESS_CONTACT_HREF, RESEARCH_CONTACT_HREF } from './landingContactLinks'
import { landingContainer, landingH2 } from './landingStyles'

export function PlatformProductsSection() {
  const t = useTranslations('pages.Landing.Products')
  const products = [
    {
      key: 'b2c',
      glyph: 'heart' as DoodleName,
      tone: 'rose' as DoodleTone,
      decor: '-bottom-10 -right-10 rotate-[-16deg]',
      label: t('b2c.label'),
      title: t('b2c.title'),
      description: t('b2c.description'),
      cta: t('b2c.cta'),
      href: '#b2c-experience',
      className:
        'lg:col-span-5 border-[#ead3de] bg-[linear-gradient(145deg,#fff4eb_0%,#fbeafa_55%,#e8f8f3_100%)] text-[#513e5d] shadow-[0_20px_45px_rgba(171,105,146,0.12)]',
      labelClass: 'bg-white/75 text-[#96627e] border-white/90',
      descriptionClass: 'text-[#6b5b71]',
      linkClass: 'text-[#8b48a4]',
      features: [
        { key: 'checkins', glyph: 'mood' as DoodleName, tone: 'rose' as DoodleTone, text: t('b2c.features.checkins') },
        { key: 'diary', glyph: 'journal' as DoodleName, tone: 'rose' as DoodleTone, text: t('b2c.features.diary') },
        {
          key: 'exercises',
          glyph: 'breath' as DoodleName,
          tone: 'rose' as DoodleTone,
          text: t('b2c.features.exercises'),
        },
      ],
    },
    {
      key: 'b2b',
      glyph: 'people' as DoodleName,
      tone: 'sky' as DoodleTone,
      decor: '-right-14 top-24 rotate-[12deg]',
      label: t('b2b.label'),
      title: t('b2b.title'),
      description: t('b2b.description'),
      cta: t('b2b.cta'),
      href: BUSINESS_CONTACT_HREF,
      className:
        'lg:col-span-4 border-[#cad9fa] bg-[linear-gradient(145deg,#e7f3ff_0%,#d9e8fc_58%,#e8e4fc_100%)] text-[#2d426f] shadow-[0_20px_45px_rgba(85,120,182,0.12)]',
      labelClass: 'bg-white/70 text-[#4a70a5] border-white/90',
      descriptionClass: 'text-[#536888]',
      linkClass: 'text-[#3154a4]',
      features: [
        { key: 'teams', glyph: 'shield' as DoodleName, tone: 'sky' as DoodleTone, text: t('b2b.features.teams') },
        {
          key: 'analytics',
          glyph: 'chart' as DoodleName,
          tone: 'sky' as DoodleTone,
          text: t('b2b.features.analytics'),
        },
        {
          key: 'decisions',
          glyph: 'briefcase' as DoodleName,
          tone: 'sky' as DoodleTone,
          text: t('b2b.features.decisions'),
        },
      ],
    },
    {
      key: 'rd',
      glyph: 'flask' as DoodleName,
      tone: 'lilac' as DoodleTone,
      decor: '-bottom-16 right-12 rotate-[24deg]',
      label: t('rd.label'),
      title: t('rd.title'),
      description: t('rd.description'),
      cta: t('rd.cta'),
      href: RESEARCH_CONTACT_HREF,
      className:
        'md:col-span-2 lg:col-span-3 border-[#e2d5f3] bg-[linear-gradient(145deg,#f5eaff_0%,#ede8ff_60%,#faf1fc_100%)] text-[#55466a] shadow-[0_20px_45px_rgba(128,91,169,0.1)]',
      labelClass: 'bg-white/70 text-[#80639e] border-white/90',
      descriptionClass: 'text-[#756584]',
      linkClass: 'text-[#7650a2]',
      features: [
        { key: 'cohorts', glyph: 'flask' as DoodleName, tone: 'lilac' as DoodleTone, text: t('rd.features.cohorts') },
        {
          key: 'validation',
          glyph: 'chart' as DoodleName,
          tone: 'lilac' as DoodleTone,
          text: t('rd.features.validation'),
        },
        { key: 'reports', glyph: 'report' as DoodleName, tone: 'lilac' as DoodleTone, text: t('rd.features.reports') },
      ],
    },
  ] as const

  return (
    <section id="products" aria-labelledby="products-heading" className="scroll-mt-5 bg-white">
      <div className={landingContainer}>
        <div className="mb-8 max-w-2xl">
          <h2 id="products-heading" className={landingH2}>
            {t('heading')}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[#6a6077]">{t('description')}</p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-12">
          {products.map(
            ({
              key,
              glyph,
              tone,
              decor,
              label,
              title,
              description,
              features,
              href,
              cta,
              className,
              labelClass,
              descriptionClass,
              linkClass,
            }) => (
              <article
                key={key}
                className={`group relative isolate flex min-h-[340px] flex-col overflow-hidden rounded-[30px] border p-6 transition-transform duration-300 hover:-translate-y-1 tablet:p-7 ${className}`}
              >
                <DoodleIcon
                  name={glyph}
                  tone={tone}
                  size={180}
                  plain
                  className={`pointer-events-none absolute -z-10 opacity-25 transition-transform duration-700 group-hover:scale-105 ${decor}`}
                />
                <div className="relative mb-7">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-xs font-semibold ${labelClass}`}
                  >
                    <DoodleIcon name={glyph} tone={tone} size={28} />
                    {label}
                  </span>
                </div>

                <h3 className="relative max-w-md text-[1.45rem] font-semibold leading-[1.18] tracking-tight tablet:text-[1.55rem]">
                  {title}
                </h3>
                <p className={`relative mt-3 max-w-md text-sm leading-[1.7] ${descriptionClass}`}>{description}</p>

                <ul className="relative my-6 space-y-3">
                  {features.map(({ key: featureKey, glyph: featureGlyph, text }) => (
                    <li key={featureKey} className="flex items-start gap-3 text-sm leading-relaxed">
                      <DoodleIcon name={featureGlyph} tone="paper" size={44} />
                      <span className="pt-1">{text}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={href}
                  className={`relative mt-auto inline-flex min-h-11 w-fit items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 ${linkClass}`}
                >
                  {cta}
                  <ArrowUpRight
                    aria-hidden
                    size={18}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
                {key === 'b2b' && (
                  <Link
                    href={Routes.SERVICES}
                    className="relative mt-1 inline-flex min-h-10 w-fit items-center text-xs font-medium text-[#526d9d] underline-offset-4 hover:underline"
                  >
                    {t('b2b.detailsCta')}
                  </Link>
                )}
              </article>
            )
          )}
        </div>
      </div>
    </section>
  )
}
