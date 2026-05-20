import { ArrowRight, Shield, Users } from 'lucide-react'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { LandingFooter } from '@/components/features/Landing'
import { CompanyHeader } from '@/components/Layout/Header/CompanyHeader'
import { mainVariants } from '@/components/Layout/mainVariants'
import { Routes } from '@/constants/routes'
import { PageTitle } from '@/ds/components/PageTitle'
import { Link } from '@/i18n/navigation'
import { getServerSession } from '@/lib/get-server-session'
import { cn } from '@/lib/utils'
import { COMPANY_ROLES } from '@/types/rbac'

export default async function CompanyDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await getServerSession()
  const role = session?.user?.companyRole

  if (session?.user?.role !== 'admin') {
    if (role === COMPANY_ROLES.SUPERUSER) {
      redirect(`/${locale}${Routes.COMPANY_ADMIN}`)
    }

    if (role === COMPANY_ROLES.MANAGER) {
      redirect(`/${locale}${Routes.COMPANY_MANAGER}`)
    }

    redirect(`/${locale}`)
  }

  const t = await getTranslations('pages.Company.dashboard')

  return (
    <div className="relative flex w-full flex-1 justify-center">
      <div className="pointer-events-none absolute inset-0 z-0 flex h-full w-full">
        <div className="h-full w-1/2 bg-background" />
        <div className="h-full w-1/2 bg-background-alt" />
      </div>
      <div className="container-max-width relative z-10 flex w-full">
        <main className={mainVariants({ layout: 'noSidebar' })}>
          <div className="padded flex w-full flex-col gap-sm tablet:gap-6 sm:gap-md">
            <CompanyHeader />
            <PageTitle title={t('title')} subtitle={t('subtitle')} />

            <div className="grid gap-md xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
              <section className="rounded-[2rem] border border-sky-100/80 bg-white/90 p-6 shadow-[0_24px_80px_rgba(14,116,144,0.14)] sm:p-8">
                <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">{t('description')}</p>

                <div className="mt-6 grid gap-md md:grid-cols-2">
                  <Link
                    href={Routes.COMPANY_ADMIN}
                    className={cn(
                      'group rounded-[1.75rem] border border-sky-100 bg-[linear-gradient(180deg,rgba(240,249,255,0.96),rgba(224,242,254,0.88))] p-6 text-left shadow-[0_18px_55px_rgba(14,116,144,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(14,116,144,0.18)]'
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <Shield className="h-8 w-8 text-sky-700" />
                      <ArrowRight className="h-5 w-5 text-sky-500 transition group-hover:translate-x-0.5" />
                    </div>
                    <h2 className="mt-6 text-xl font-semibold text-slate-900">{t('adminPanel')}</h2>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{t('adminDescription')}</p>
                  </Link>

                  <Link
                    href={Routes.COMPANY_MANAGER}
                    className={cn(
                      'group rounded-[1.75rem] border border-sky-100 bg-[linear-gradient(180deg,rgba(248,250,252,0.98),rgba(240,249,255,0.9))] p-6 text-left shadow-[0_18px_55px_rgba(14,116,144,0.1)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(14,116,144,0.16)]'
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <Users className="h-8 w-8 text-sky-700" />
                      <ArrowRight className="h-5 w-5 text-sky-500 transition group-hover:translate-x-0.5" />
                    </div>
                    <h2 className="mt-6 text-xl font-semibold text-slate-900">{t('managerPanel')}</h2>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{t('managerDescription')}</p>
                  </Link>
                </div>
              </section>

              <aside className="rounded-[2rem] border border-sky-200/80 bg-[linear-gradient(180deg,rgba(224,242,254,0.92),rgba(186,230,253,0.82))] p-6 shadow-[0_24px_80px_rgba(14,116,144,0.12)] sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                  {t('serviceAdminEyebrow')}
                </p>
                <h2 className="mt-4 text-2xl font-semibold text-slate-900">{t('serviceAdminTitle')}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-700 sm:text-base">{t('serviceAdminDescription')}</p>

                <div className="mt-6 rounded-[1.5rem] border border-white/70 bg-white/70 p-5">
                  <p className="text-sm font-medium text-slate-900">{t('serviceAdminNoteTitle')}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{t('serviceAdminNoteDescription')}</p>
                </div>

                <Link
                  href={Routes.ADMIN}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-800 transition hover:text-sky-950"
                >
                  {t('serviceAdminLink')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </aside>
            </div>
          </div>
          <LandingFooter type="small" className="bg-none" />
        </main>
      </div>
    </div>
  )
}
