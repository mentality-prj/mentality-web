import { getTranslations } from 'next-intl/server'

import { ApiKeyFlashBanner } from '@/components/features/Dip/ApiKeyFlashBanner'
import { SystemView } from '@/components/features/Dip/SystemView'
import {
  getDipOrganizationKeys,
  getDipOrganizationStructure,
  getDipOrganizationsWithConnection,
} from '@/requests/dipClient'

export default async function DipSystemPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ org?: string; success?: string; error?: string }>
}) {
  const [{ locale }, query] = await Promise.all([params, searchParams])

  const [t, organizationResult] = await Promise.all([getTranslations('pages.Dip'), getDipOrganizationsWithConnection()])
  const { organizations, connection: orgConnection } = organizationResult
  const adminConnection = orgConnection

  const selectedOrgId =
    query.org && organizations.some((organization) => organization.id === query.org)
      ? query.org
      : (organizations[0]?.id ?? null)
  const structure = selectedOrgId ? await getDipOrganizationStructure(selectedOrgId) : null
  const keys = selectedOrgId ? await getDipOrganizationKeys(selectedOrgId) : []

  return (
    <>
      <ApiKeyFlashBanner locale={locale} />
      <SystemView
        locale={locale}
        organizations={organizations}
        selectedOrgId={selectedOrgId}
        members={structure?.members ?? []}
        units={structure?.units ?? []}
        keys={keys}
        orgConnection={orgConnection}
        adminConnection={adminConnection}
        successMessage={query.success ?? null}
        errorMessage={query.error ?? null}
        t={t}
      />
    </>
  )
}
