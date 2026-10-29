import {
  Activity,
  ArrowUpRight,
  BarChart3,
  BookOpenText,
  BriefcaseBusiness,
  FlaskConical,
  ShieldCheck,
  Wind,
} from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/navigation'

import { BUSINESS_CONTACT_HREF, RESEARCH_CONTACT_HREF } from './landingContactLinks'

export function PlatformProductsSection() {
  const t = useTranslations('pages.Landing.Products')
  const products = [
    {
      key: 'b2c',
      Icon: Activity,
      label: t('b2c.label'),
      title: t('b2c.title'),
      description: t('b2c.description'),
      cta: t('b2c.cta'),
      href: '#b2c-experience',
      className:
        'lg:col-span-5 border-[#ead3de] bg-[linear-gradient(145deg,#fff4eb_0%,#fbeafa_55%,#e8f8f3_100%)] text-[#513e5d] shadow-[0_20px_45px_rgba(171,105,146,0.12)]',
      labelClass: 'bg-white/75 text-[#96627e] border-white/90',
      descriptionClass: 'text-[#6b5b71]',
      featureClass: 'bg-white/65 text-[#6d5274]',
      linkClass: 'text-[#8b48a4]',
      iconClass: 'text-[#c587a4]',
      features: [
        { key: 'checkins', Icon: Activity, text: t('b2c.features.checkins') },
        { key: 'diary', Icon: BookOpenText, text: t('b2c.features.diary') },
        { key: 'exercises', Icon: Wind, text: t('b2c.features.exercises') },
      ],
    },
    {
      key: 'b2b',
      Icon: BriefcaseBusiness,
      label: t('b2b.label'),
      title: t('b2b.title'),
      description: t('b2b.description'),
      cta: t('b2b.cta'),
      href: BUSINESS_CONTACT_HREF,
      className:
        'lg:col-span-4 border-[#cad9fa] bg-[linear-gradient(145deg,#e7f3ff_0%,#d9e8fc_58%,#e8e4fc_100%)] text-[#2d426f] shadow-[0_20px_45px_rgba(85,120,182,0.12)]',
      labelClass: 'bg-white/70 text-[#4a70a5] border-white/90',
      descriptionClass: 'text-[#536888]',
      featureClass: 'bg-white/70 text-[#4c68a0]',
      linkClass: 'text-[#3154a4]',
      iconClass: 'text-[#7396cb]',
      features: [
        { key: 'teams', Icon: ShieldCheck, text: t('b2b.features.teams') },
        { key: 'analytics', Icon: BarChart3, text: t('b2b.features.analytics') },
        { key: 'decisions', Icon: BriefcaseBusiness, text: t('b2b.features.decisions') },
      ],
    },
    {
      key: 'rd',
      Icon: FlaskConical,
      label: t('rd.label'),
      title: t('rd.title'),
      description: t('rd.description'),
      cta: t('rd.cta'),
      href: RESEARCH_CONTACT_HREF,
      className:
        'md:col-span-2 lg:col-span-3 border-[#e2d5f3] bg-[linear-gradient(145deg,#f5eaff_0%,#ede8ff_60%,#faf1fc_100%)] text-[#55466a] shadow-[0_20px_45px_rgba(128,91,169,0.1)]',
      labelClass: 'bg-white/70 text-[#80639e] border-white/90',
      descriptionClass: 'text-[#756584]',
      featureClass: 'bg-white/65 text-[#775c96]',
      linkClass: 'text-[#7650a2]',
      iconClass: 'text-[#a18ac4]',
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
      className="scroll-mt-5 bg-[linear-gradient(180deg,#fff8f9_0%,#fff_55%,#f7f5ff_100%)]"
    >
      <div className="container-max-width mx-auto px-4 py-12 tablet:px-6 tablet:py-16 md:px-8 md:py-20 lg:px-10">
        <div className="mb-8 max-w-2xl">
          <h2
            id="products-heading"
            className="text-[1.75rem] font-semibold leading-tight text-[#383053] tablet:text-[2.35rem]"
          >
            {t('heading')}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[#6a6077]">{t('description')}</p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-12">
          {products.map(
            ({
              key,
              Icon,
              label,
              title,
              description,
              features,
              href,
              cta,
              className,
              labelClass,
              descriptionClass,
              featureClass,
              linkClass,
              iconClass,
            }) => (
              <article
                key={key}
                className={`group relative isolate flex min-h-[340px] flex-col overflow-hidden rounded-[30px] border p-6 transition-transform duration-300 hover:-translate-y-1 tablet:p-7 ${className}`}
              >
                <Icon
                  aria-hidden
                  strokeWidth={1}
                  className={`pointer-events-none absolute -right-6 top-14 h-36 w-36 rotate-[-13deg] opacity-20 ${iconClass}`}
                />
                <div className="relative mb-7">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${labelClass}`}
                  >
                    <Icon aria-hidden size={17} strokeWidth={1.7} />
                    {label}
                  </span>
                </div>

                <h3 className="relative max-w-md text-[1.45rem] font-semibold leading-[1.18] tracking-tight tablet:text-[1.55rem]">
                  {title}
                </h3>
                <p className={`relative mt-3 max-w-md text-sm leading-[1.7] ${descriptionClass}`}>{description}</p>

                <ul className="relative my-6 space-y-3">
                  {features.map(({ key: featureKey, Icon: FeatureIcon, text }) => (
                    <li key={featureKey} className="flex items-start gap-3 text-sm leading-relaxed">
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${featureClass}`}>
                        <FeatureIcon aria-hidden size={17} strokeWidth={1.7} />
                      </span>
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
