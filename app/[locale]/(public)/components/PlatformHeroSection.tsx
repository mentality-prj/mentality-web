import { ArrowDownRight, ArrowUpRight, BookOpenText, Heart, Sparkles, Wind } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/navigation'

import { BUSINESS_CONTACT_HREF } from './landingContactLinks'

/**
 * Dzvin is introduced through the person's day, not through enterprise reporting.
 * This is a decorative product vignette — it contains no fabricated user data.
 */
export function PlatformHeroSection({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const t = useTranslations('pages.Landing.Platform')

  return (
    <section
      aria-labelledby="platform-heading"
      className="relative isolate overflow-hidden bg-[linear-gradient(120deg,#fff1e8_0%,#fceafa_36%,#e8f4ff_72%,#def7f0_100%)]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-40 h-[430px] w-[520px] rounded-full bg-[#ffb9a9]/45 blur-[95px]" />
        <div className="absolute -bottom-52 left-[22%] h-[440px] w-[540px] rounded-full bg-[#cca7ff]/35 blur-[95px]" />
        <div className="absolute -right-32 top-[10%] h-[540px] w-[480px] rounded-full bg-[#8fe8d7]/35 blur-[95px]" />
      </div>
      <div className="container-max-width relative mx-auto grid items-center gap-9 px-4 pb-12 pt-10 tablet:px-6 tablet:pb-16 tablet:pt-14 md:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] md:gap-14 md:px-8 md:py-20 lg:px-10">
        <div className="flex flex-col items-start gap-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#f0cce0] bg-white/65 px-4 py-2 text-xs font-semibold tracking-wide text-[#795179] shadow-sm backdrop-blur-sm">
            <Heart aria-hidden size={17} strokeWidth={1.8} />
            {t('eyebrow')}
          </span>
          <h1 id="platform-heading" className="landing-h1 max-w-[43rem] text-[#302a4f]">
            {t('title')}
          </h1>
          <p className="max-w-[38rem] text-base leading-[1.75] text-[#575570] tablet:text-lg">{t('subtitle')}</p>
          <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href={isAuthenticated ? Routes.MYDAY : '#b2c-experience'}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[linear-gradient(110deg,#a452bd,#6b58d9)] px-7 py-3 text-center text-sm font-semibold text-white shadow-[0_14px_30px_rgba(130,80,174,0.22)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7153c8]"
            >
              {isAuthenticated ? t('returnCta') : t('primaryCta')}
              <ArrowDownRight aria-hidden size={18} />
            </Link>
            <a
              href="#products"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#d3bddf] bg-white/75 px-6 py-3 text-center text-sm font-semibold text-[#59446c] backdrop-blur-sm transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7153c8]"
            >
              {t('secondaryCta')}
            </a>
          </div>
          <Link
            href={BUSINESS_CONTACT_HREF}
            className="mt-1 inline-flex min-h-10 items-center gap-2 text-sm font-medium text-[#5e5580] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {t('businessCta')}
            <ArrowUpRight aria-hidden size={16} />
          </Link>
        </div>

        <div className="relative mx-auto w-full max-w-[520px] py-4" aria-hidden="true">
          <div className="pointer-events-none absolute inset-6 -rotate-[5deg] rounded-[38px] bg-[#c1eedd]/80 blur-[4px]" />
          <div className="pointer-events-none absolute inset-4 rotate-[4deg] rounded-[38px] bg-[#d8ccf8]/85" />
          <div className="relative overflow-hidden rounded-[32px] border border-white/90 bg-white/90 p-5 shadow-[0_35px_75px_rgba(93,78,136,0.18)] tablet:p-7">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f5e2fc] text-[#8f53a7]">
                <Heart size={23} strokeWidth={1.8} />
              </div>
              <span className="rounded-full bg-[#f7edf9] px-3 py-1.5 text-xs font-medium text-[#8a588c]">DZVIN</span>
            </div>
            <h2 className="text-[1.45rem] font-semibold leading-tight tracking-tight text-[#393451] tablet:text-[1.65rem]">
              {t('visual.title')}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#756d84]">{t('visual.subtitle')}</p>

            <div className="mt-6 rounded-[22px] bg-[linear-gradient(120deg,#fff1ed,#f8ecfa)] p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#754d78]">
                <Sparkles size={17} strokeWidth={1.8} />
                {t('visual.checkin')}
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5c9b7] text-[#824b56]">
                  <Heart size={21} />
                </span>
                <span className="h-1.5 flex-1 rounded-full bg-[linear-gradient(90deg,#efb6aa,#d9b9ef,#a6d8e5)]" />
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d9cbf5] text-[#6d5b99]">
                  <Sparkles size={21} />
                </span>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-[20px] border border-[#ebdfed] bg-[#faf6fd] p-4">
                <BookOpenText size={22} strokeWidth={1.7} className="text-[#8b69aa]" />
                <p className="mt-3 text-sm font-semibold text-[#5a4b69]">{t('visual.journal')}</p>
              </div>
              <div className="rounded-[20px] border border-[#d4ebe3] bg-[#edf9f4] p-4">
                <Wind size={22} strokeWidth={1.7} className="text-[#328d78]" />
                <p className="mt-3 text-sm font-semibold text-[#426b61]">{t('visual.practice')}</p>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute -bottom-1 -left-4 h-14 w-14 rounded-full bg-[#ffd1b7]/80 blur-md tablet:-left-7 tablet:h-20 tablet:w-20" />
        </div>
      </div>
    </section>
  )
}
