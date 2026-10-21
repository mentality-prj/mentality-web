import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { BusinessLeadForm } from '@/components/features/Business/BusinessLeadForm'
import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/navigation'
import { publicPageMetadata } from '@/lib/seo/publicPageMetadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pages.Business' })
  return publicPageMetadata({ locale, path: '/business', title: t('metaTitle'), description: t('metaDescription') })
}

export default async function BusinessPage() {
  const t = await getTranslations('pages.Business')
  const features = t.raw('features') as string[]
  const steps = t.raw('process') as string[]

  return (
    <div className="bg-[linear-gradient(135deg,#fff3ed_0%,#f7f0ff_50%,#eaf8f7_100%)]">
      <div className="container-max-width mx-auto px-4 py-10 tablet:px-6 tablet:py-14 md:px-8 lg:px-10">
        <Link
          href={Routes.MAIN}
          className="text-sm font-medium text-[#615675] underline-offset-4 hover:underline"
        >
          {t('back')}
        </Link>
        <div className="mt-8 grid items-start gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-7">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-[#8b527c]">{t('eyebrow')}</p>
              <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-[#302a4f] tablet:text-5xl">
                {t('title')}
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-[#59556f] tablet:text-lg">
                {t('subtitle')}
              </p>
              <p className="max-w-xl rounded-2xl border border-[#ddcfe8] bg-white/65 px-4 py-3 text-sm leading-relaxed text-[#605875]">
                {t('availability')}
              </p>
            </div>

            <section aria-labelledby="business-features-heading">
              <h2 id="business-features-heading" className="text-xl font-semibold text-[#302a4f]">
                {t('featuresHeading')}
              </h2>
              <ul className="mt-4 space-y-3">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm leading-relaxed text-[#575570]">
                    <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#9167bf]" />
                    {feature}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="business-steps-heading">
              <h2 id="business-steps-heading" className="text-xl font-semibold text-[#302a4f]">
                {t('processHeading')}
              </h2>
              <ol className="mt-4 space-y-3">
                {steps.map((step, index) => (
                  <li key={step} className="flex items-start gap-3 text-sm leading-relaxed text-[#575570]">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e8dafa] font-semibold text-[#7250a5]">
                      {index + 1}
                    </span>
                    <span className="pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            <p className="max-w-xl border-l-[3px] border-[#7c73ba] pl-4 text-sm leading-relaxed text-[#575570]">
              {t('privacy')}
            </p>
          </div>

          <BusinessLeadForm />
        </div>
      </div>
    </div>
  )
}
