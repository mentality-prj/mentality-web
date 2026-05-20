import { redirect } from 'next/navigation'

import { Routes } from '@/constants/routes'

export default async function AdminResearchPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  redirect(`/${locale}${Routes.ADMIN_R_AND_D_DIAGNOSTICS}`)
}
