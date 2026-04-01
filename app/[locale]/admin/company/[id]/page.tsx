import { redirect } from 'next/navigation'

import { Routes } from '@/constants/routes'

export default async function AdminCompanyDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params
  redirect(`/${locale}${Routes.adminCompanyGroups(id)}`)
}
