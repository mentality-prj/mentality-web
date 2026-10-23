import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { LeadOperatorConsole } from '@/components/features/LeadPipeline/LeadOperatorConsole'
import { Routes } from '@/constants/routes'
import { apiRequest } from '@/helpers/api-wrapper'
import { requireServerSession } from '@/lib/auth/server'
import { APIUrl } from '@/requests/config'

export const metadata: Metadata = {
  title: 'Dzvin — internal contact pipeline',
  robots: { index: false, follow: false },
}

/**
 * The server checks the internal API with its verified user session before
 * rendering the console. No company admin gains access from a UI route alone.
 */
export default async function InternalContactLeadsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await requireServerSession(`/${locale}${Routes.AUTH}`)
  if (!session?.OAuthToken) notFound()

  try {
    const result = await apiRequest<unknown>(
      session,
      `${APIUrl.replace(/\/+$/, '')}/contact/internal/leads?category=business&limit=1`,
      { method: 'GET' }
    )
    // No operator access or unavailable backend: never render private data.
    if (result.error || !Array.isArray(result.data)) notFound()
  } catch {
    notFound()
  }

  return <LeadOperatorConsole />
}
