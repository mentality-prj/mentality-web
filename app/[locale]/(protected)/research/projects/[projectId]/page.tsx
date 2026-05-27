import { redirect } from 'next/navigation'

import { Routes } from '@/constants/routes'

export default async function ResearchProjectPage({
  params,
}: {
  params: Promise<{ locale: string; projectId: string }>
}) {
  const { locale, projectId } = await params

  redirect(`/${locale}${Routes.researchProjectDashboard(projectId)}`)
}
