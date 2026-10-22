import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { LeadOperatorConsole } from '@/components/features/LeadPipeline/LeadOperatorConsole'
import { Routes } from '@/constants/routes'
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
export default async function InternalContactLeadsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const session = await requireServerSession(`/${locale}${Routes.AUTH}`)
  if (!session?.OAuthToken) notFound()

  try {
    const response = await fetch(
      `${APIUrl.replace(/\/+$/, '')}/contact/internal/leads?category=business&limit=1`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${session.OAuthToken}` },
        cache: 'no-store',
        redirect: 'manual',
        signal: AbortSignal.timeout(10000),
      },
    )
    // Fail closed when the server-side operator allowlist or backend feature
    // has not been configured; no contact metadata is rendered on failure.
    if (!response.ok) notFound()
  } catch {
    notFound()
  }

  return <LeadOperatorConsole />
}
