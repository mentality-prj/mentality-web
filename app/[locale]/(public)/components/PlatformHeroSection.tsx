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
    <section
      aria-labelledby="platform-heading"
      className="relative isolate overflow-hidden bg-[linear-gradient(132deg,#e6faff_0%,#e4f2ff_43%,#f1e6fd_77%,#faeafa_100%)]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-28 -top-28 h-[440px] w-[440px] rounded-full bg-cyan-300/35 blur-[88px] tablet:h-[580px] tablet:w-[580px]" />
        <div className="absolute -bottom-52 left-[20%] h-[420px] w-[620px] rounded-full bg-violet-300/35 blur-[110px]" />
        <div className="absolute -right-40 top-4 h-[420px] w-[480px] rounded-full bg-sky-400/20 blur-[100px]" />
      </div>
      <div className="container-max-width relative mx-auto grid items-center gap-9 px-4 py-10 tablet:px-6 tablet:py-14 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:gap-12 md:px-8 md:py-20 lg:px-10">
        <div className="flex flex-col items-start gap-5">
          <p className="inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-white/65 px-4 py-2 text-xs font-semibold tracking-wide text-[#32548e] shadow-sm backdrop-blur-sm">
            <Building2 aria-hidden size={17} />
            {t('eyebrow')}
          </p>
          <h1 id="platform-heading" className="landing-h1 max-w-[44rem] text-[#182747]">
            {t('title')}
          </h1>
          <p className="max-w-[38rem] text-base leading-[1.7] text-[#425473] tablet:text-lg">
            {t('subtitle')}
          </p>
          <div className="mt-3 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Link
              href={Routes.CONTACTS}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[linear-gradient(110deg,#7545dd,#4368e6)] px-7 py-3 text-center text-sm font-semibold text-white shadow-[0_12px_28px_rgba(90,72,205,0.25)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#604bd6]"
            >
              {t('primaryCta')}
              <ArrowUpRight aria-hidden size={17} />
            </Link>
            <Link
              href={Routes.SERVICES + '#b2b'}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#9fb9e2] bg-white/75 px-6 py-3 text-center text-sm font-semibold text-[#243963] backdrop-blur-sm transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#604bd6]"
            >
              {t('secondaryCta')}
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[560px] pb-3 pt-2">
          <div aria-hidden="true" className="pointer-events-none absolute -inset-5 rounded-[42px] bg-[linear-gradient(130deg,rgba(84,191,255,0.55),rgba(143,107,250,0.35),rgba(255,150,224,0.32))] opacity-75 blur-[34px]" />
          <div className="relative isolate overflow-hidden rounded-[34px] border border-white/55 bg-[linear-gradient(142deg,#203d85_0%,#313b88_47%,#6a429e_100%)] p-5 text-white shadow-[0_30px_85px_rgba(39,54,126,0.27)] tablet:p-7">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-[#52cbf3]/45 blur-[66px]" />
              <div className="absolute -bottom-36 left-0 h-72 w-72 rounded-full bg-[#d794ff]/40 blur-[75px]" />
              <div className="absolute right-[3%] top-[28%] h-40 w-40 rounded-full border border-white/20" />
              <div className="absolute -right-12 top-[18%] h-52 w-52 rounded-full border border-white/10" />
              <div className="absolute left-[22%] top-[-9%] h-32 w-32 rounded-full bg-white/10 blur-3xl" />
            </div>
            <div className="relative">
              <div className="mb-7 flex items-center justify-between gap-4">
                <span className="text-xs font-semibold tracking-[0.18em] text-white/75">DZVIN / B2B</span>
                <span aria-hidden="true" className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#95e9fd]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#c7b1ff]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ffaddd]" />
                </span>
              </div>
              <h2 className="max-w-[22rem] text-2xl font-semibold leading-tight tracking-tight text-white tablet:text-[1.75rem]">
                {t('capabilitiesHeading')}
              </h2>
              <ul className="mt-6 space-y-3">
                {capabilities.map(({ key, Icon, title, description }) => (
                  <li key={key} className="flex items-start gap-3.5 rounded-2xl border border-white/20 bg-white/[0.13] p-3.5 backdrop-blur-md tablet:p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-[#d9f8ff]">
                      <Icon aria-hidden size={21} strokeWidth={1.7} />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-semibold leading-snug text-white">{title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-white/85">{description}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div aria-hidden="true" className="mt-7 h-1.5 w-28 rounded-full bg-[linear-gradient(90deg,#8ce7ff,#bfb1ff,#f5ade2)]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
