import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { ResearchPartnerForm } from '@/components/features/Research/ResearchPartnerForm'
import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/navigation'
import { publicPageMetadata } from '@/lib/seo/publicPageMetadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pages.ResearchPartners' })
  return publicPageMetadata({ locale, path: '/research-partners', title: t('metaTitle'), description: t('metaDescription') })
}

/** Research partner discovery is public; private study projects stay behind authorized routes. */
export default async function ResearchPartnersPage() {
  const t = await getTranslations('pages.ResearchPartners')
  const capabilities = t.raw('capabilities') as string[]
  const steps = t.raw('steps') as string[]

  return (
    <div className="bg-[linear-gradient(135deg,#fbf1ff_0%,#f4efff_52%,#effaf8_100%)]">
      <div className="container-max-width mx-auto px-4 py-10 tablet:px-6 tablet:py-14 md:px-8 lg:px-10">
        <Link href={Routes.MAIN} className="text-sm font-medium text-[#615675] underline-offset-4 hover:underline">
          {t('back')}
        </Link>

        <div className="mt-8 grid items-start gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-7">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-[#8752a1]">{t('eyebrow')}</p>
              <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-[#302a4f] tablet:text-5xl">
                {t('title')}
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-[#59556f] tablet:text-lg">
                {t('subtitle')}
              </p>
              <p className="max-w-xl rounded-2xl border border-[#ddcfe8] bg-white/65 px-4 py-3 text-sm leading-relaxed text-[#605875]">
                {t('state')}
              </p>
            </div>

            <section aria-labelledby="research-capabilities-heading">
              <h2 id="research-capabilities-heading" className="text-xl font-semibold text-[#302a4f]">
                {t('capHeading')}
              </h2>
              <ul className="mt-4 space-y-3">
                {capabilities.map((capability) => (
                  <li key={capability} className="flex items-start gap-3 text-sm leading-relaxed text-[#575570]">
                    <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#906cbe]" />
                    {capability}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-[#e7d7ee] bg-white/70 p-5" aria-labelledby="research-forecast-heading">
              <h2 id="research-forecast-heading" className="font-semibold text-[#383053]">{t('forecastTitle')}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#59556f]">{t('forecastBody')}</p>
            </section>

            <section aria-labelledby="research-steps-heading">
              <h2 id="research-steps-heading" className="text-xl font-semibold text-[#302a4f]">
                {t('stepsHeading')}
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

            <p className="max-w-xl border-l-[3px] border-[#8274b8] pl-4 text-sm leading-relaxed text-[#575570]">
              {t('privacy')}
            </p>
          </div>
          <ResearchPartnerForm />
        </div>
      </div>
    </div>
  )
}
