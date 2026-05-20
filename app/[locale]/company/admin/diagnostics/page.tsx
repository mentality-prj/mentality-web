import { redirect } from 'next/navigation'

import { Routes } from '@/constants/routes'
import { getServerSession } from '@/lib/get-server-session'

export default async function CompanyAdminDiagnosticsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await getServerSession()

  if (session?.user?.role !== 'admin') {
    redirect(`/${locale}${Routes.COMPANY}`)
  }

  redirect(`/${locale}${Routes.ADMIN_R_AND_D_DIAGNOSTICS}`)
}
