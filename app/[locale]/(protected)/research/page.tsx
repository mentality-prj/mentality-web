import { redirect } from 'next/navigation'

import { Routes } from '@/constants/routes'

export default async function ResearchPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  redirect(`/${locale}${Routes.RESEARCH_PROJECTS}`)
}
