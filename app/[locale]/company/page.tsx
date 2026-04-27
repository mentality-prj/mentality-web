import { Plus, Shield, Users } from 'lucide-react'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { LandingFooter } from '@/components/features/Landing'
import { CompanyHeader } from '@/components/Layout/Header/CompanyHeader'
import { Routes } from '@/constants/routes'
import { PageTitle } from '@/ds/components/PageTitle'
import { Link } from '@/i18n/navigation'
import { getServerSession } from '@/lib/get-server-session'
import { COMPANY_ROLES } from '@/types/rbac'
import { buttonVariants } from '@/ui/button'

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
        <main className="old-paper min-h-screen w-full flex-1 flex-col items-start justify-between">
          <div className="padded flex w-full flex-col gap-sm tablet:gap-6 sm:gap-md">
            <CompanyHeader />
            <PageTitle title={t('title')} />

            <div className="flex flex-wrap gap-md">
              <Link href={Routes.COMPANY_ADMIN} className={buttonVariants({ variant: 'default', size: 'large' })}>
                <Shield className="mr-2 h-5 w-5" />
                {t('adminPanel')}
              </Link>
              <Link href={Routes.COMPANY_MANAGER} className={buttonVariants({ variant: 'default', size: 'large' })}>
                <Users className="mr-2 h-5 w-5" />
                {t('managerPanel')}
              </Link>
              <Link
                href={Routes.COMPANY_GLOBAL_ADMIN}
                className={buttonVariants({ variant: 'secondary', size: 'large' })}
              >
                <Plus className="mr-2 h-5 w-5" />
                {t('createCompany')}
              </Link>
            </div>
          </div>
          <LandingFooter type="small" className="bg-none" />
        </main>
      </div>
    </div>
  )
}
