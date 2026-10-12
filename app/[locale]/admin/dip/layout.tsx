import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { DipWorkspaceNav } from '@/components/features/Dip/DipWorkspaceNav'
import { getServerSession } from '@/lib/auth/server'

export default async function DipAdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const session = await getServerSession()
  const t = await getTranslations('pages.Dip')

  if (session?.user?.role !== 'admin') {
    redirect(`/${locale}`)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-background-alt">
        <div className="mx-auto max-w-screen-xl px-6 py-4">
          <div className="flex items-baseline gap-3">
            <h1 className="text-lg font-semibold text-textcolor-primary">{t('title')}</h1>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {t('versionBadge')}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-textcolor-secondary">{t('subtitle')}</p>
        </div>
      </header>
      <DipWorkspaceNav locale={locale} />
      <main className="mx-auto w-full max-w-screen-xl flex-1 px-6 py-6">{children}</main>
    </div>
  )
}
