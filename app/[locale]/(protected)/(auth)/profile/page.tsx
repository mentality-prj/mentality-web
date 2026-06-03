import { getTranslations } from 'next-intl/server'

import { UserProfile } from '@/components/features/Profile'
import { AnalyticsReportSettings } from '@/components/features/Settings/AnalyticsReportSettings'
import { StaticCard } from '@/components/shared/Cards/StaticCard'
import { PageTitle } from '@/ds/components/PageTitle'
import { getServerSession } from '@/lib/get-server-session'
import { COMPANY_ROLES } from '@/types/rbac'

const emptyValue = 'Не вказано'

export default async function ProfilePage() {
  const t = await getTranslations('pages.Profile')
  const session = await getServerSession()

  const user = session?.user
  const canViewSettings = user?.role === 'admin' || user?.companyRole === COMPANY_ROLES.MANAGER
  const profileDetails = [
    { label: t('details.id'), value: user?.id ?? emptyValue },
    { label: t('details.role'), value: user?.role ?? emptyValue },
    { label: t('details.companyRole'), value: user?.companyRole ?? emptyValue },
    { label: t('details.aiAccess'), value: user?.isAIAuthorized ? t('details.enabled') : t('details.disabled') },
  ]

  return (
    <div className="w-full space-y-6">
      <PageTitle title={t('title')} subtitle={t('subtitle')} />

      <div className="grid gap-6">
        <StaticCard className="border border-border bg-background">
          {user?.name && <UserProfile name={user.name} image={user.image} email={user.email} />}
          <p className="mt-4 text-sm text-textcolor-secondary">{t('identityNote')}</p>
        </StaticCard>

        <StaticCard className="border border-border bg-background">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-textcolor-primary">{t('details.title')}</h2>
            <p className="text-sm text-textcolor-secondary">{t('details.subtitle')}</p>
          </div>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {profileDetails.map((item) => (
              <div key={item.label} className="rounded-xl bg-background-alt p-4">
                <dt className="text-xs uppercase tracking-wide text-textcolor-secondary">{item.label}</dt>
                <dd className="mt-2 break-words text-base text-textcolor-primary">{item.value}</dd>
              </div>
            ))}
          </dl>
        </StaticCard>

        {canViewSettings && (
          <section id="settings" className="scroll-mt-24">
            <StaticCard className="border border-border bg-background">
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-textcolor-secondary">
                  {t('settings.eyebrow')}
                </p>
                <h2 className="text-lg font-semibold text-textcolor-primary">{t('settings.title')}</h2>
                <p className="text-sm text-textcolor-secondary">{t('settings.subtitle')}</p>
              </div>

              <div className="mt-6">
                <AnalyticsReportSettings />
              </div>
            </StaticCard>
          </section>
        )}
      </div>
    </div>
  )
}
