import {
  createOrganizationAction,
  createOrganizationKeyAction,
  createOrganizationMemberAction,
  createOrganizationUnitAction,
  revokeOrganizationKeyAction,
  updateOrganizationMemberRoleAction,
} from '@/app/[locale]/admin/dip/system/actions'
import { DipConnectionBanner } from '@/components/features/Dip/DipConnectionBanner'
import type {
  DipApiKey,
  DipConnectionStatus,
  DipOrganization,
  DipOrganizationMember,
  DipOrganizationUnit,
} from '@/types/dip'

function formatDate(dateStr: string, locale: string): string {
  try {
    const intlLocale = locale.startsWith('uk') ? 'uk-UA' : locale.startsWith('pl') ? 'pl-PL' : 'en-US'
    return new Date(dateStr).toLocaleDateString(intlLocale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

type Props = {
  locale: string
  organizations: DipOrganization[]
  selectedOrgId: string | null
  members: DipOrganizationMember[]
  units: DipOrganizationUnit[]
  keys: DipApiKey[]
  orgConnection: DipConnectionStatus
  adminConnection: DipConnectionStatus
  successMessage: string | null
  errorMessage: string | null
  t: (key: string) => string
}

function unitNameById(units: DipOrganizationUnit[], unitId: string | null): string {
  if (!unitId) return '—'
  return units.find((item) => item.id === unitId)?.name ?? unitId
}

export function SystemView({
  locale,
  organizations,
  selectedOrgId,
  members,
  units,
  keys,
  orgConnection,
  adminConnection,
  successMessage,
  errorMessage,
  t,
}: Props) {
  const selectedOrg = organizations.find((org) => org.id === selectedOrgId) ?? null

  return (
    <div className="space-y-8">
      {successMessage ? (
        <div className="whitespace-pre-line rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
          {successMessage}
        </div>
      ) : null}
      {errorMessage ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-800">
          {errorMessage}
        </div>
      ) : null}

      <section>
        <h2 className="mb-4 text-base font-semibold text-textcolor-primary">{t('system.connection')}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-background p-5">
            <div className="flex items-center gap-3">
              <div
                className={`h-2.5 w-2.5 rounded-full ${orgConnection.configured ? 'bg-emerald-500' : 'bg-rose-500'}`}
              />
              <p className="font-medium text-textcolor-primary">
                {orgConnection.configured ? t('system.orgKeyConnected') : t('system.orgKeyMissing')}
              </p>
            </div>
            {orgConnection.url ? (
              <p className="mt-2 font-mono text-xs text-textcolor-secondary">{orgConnection.url}</p>
            ) : null}
          </div>
          <div className="rounded-2xl border border-border bg-background p-5">
            <div className="flex items-center gap-3">
              <div
                className={`h-2.5 w-2.5 rounded-full ${adminConnection.configured ? 'bg-emerald-500' : 'bg-rose-500'}`}
              />
              <p className="font-medium text-textcolor-primary">
                {adminConnection.configured ? t('system.adminKeyConnected') : t('system.adminKeyMissing')}
              </p>
            </div>
            {adminConnection.url ? (
              <p className="mt-2 font-mono text-xs text-textcolor-secondary">{adminConnection.url}</p>
            ) : null}
          </div>
        </div>
      </section>

      <DipConnectionBanner
        connection={adminConnection}
        notConfiguredLabel={t('system.adminBannerLabel')}
        notConfiguredHint={t('system.adminBannerHint')}
        credentialsHintLines={['DIP_URL=http://localhost:8000', 'DIP_ADMIN_API_KEY=<platform-admin-key>']}
      />

      <DipConnectionBanner
        connection={orgConnection}
        notConfiguredLabel={t('notConfigured.label')}
        notConfiguredHint={t('notConfigured.hint')}
      />

      <section className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-background p-5">
            <h2 className="mb-4 text-base font-semibold text-textcolor-primary">{t('system.organizations')}</h2>
            <form action={createOrganizationAction} className="space-y-3">
              <input type="hidden" name="locale" value={locale} />
              <div>
                <label className="mb-1 block text-xs font-medium text-textcolor-secondary">
                  {t('system.organizationName')}
                </label>
                <input
                  name="name"
                  required
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-textcolor-primary"
                  placeholder={t('system.organizationPlaceholder')}
                />
              </div>
              <button className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                {t('system.createOrganization')}
              </button>
            </form>

            <div className="mt-5 space-y-2">
              {organizations.length === 0 ? (
                <p className="text-sm text-textcolor-secondary">{t('system.organizationsEmpty')}</p>
              ) : (
                organizations.map((org) => {
                  const active = org.id === selectedOrgId
                  return (
                    <a
                      key={org.id}
                      href={`/${locale}/admin/dip/system?org=${org.id}`}
                      className={`block rounded-xl border px-4 py-3 transition-colors ${
                        active ? 'border-primary bg-primary/5' : 'border-border bg-background hover:bg-background-alt'
                      }`}
                    >
                      <p className="font-medium text-textcolor-primary">{org.name}</p>
                      <p className="mt-0.5 font-mono text-xs text-textcolor-secondary">{org.id}</p>
                      <p className="mt-1 text-xs text-textcolor-secondary">{formatDate(org.createdAt, locale)}</p>
                    </a>
                  )
                })
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-background px-5 py-4">
            <h2 className="text-base font-semibold text-textcolor-primary">{t('system.platform')}</h2>
            <div className="mt-4 grid gap-3 text-sm">
              <div>
                <p className="text-textcolor-secondary">{t('system.platformVersion')}</p>
                <p className="mt-0.5 font-mono text-textcolor-primary">v0.7</p>
              </div>
              <div>
                <p className="text-textcolor-secondary">{t('system.nextVersion')}</p>
                <p className="mt-0.5 font-mono text-textcolor-primary">v0.8 — Model Registry + ML Plugin</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          {selectedOrg ? (
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-background p-5">
                <h2 className="text-lg font-semibold text-textcolor-primary">{selectedOrg.name}</h2>
                <p className="mt-1 font-mono text-xs text-textcolor-secondary">{selectedOrg.id}</p>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <div className="rounded-xl bg-background-alt px-4 py-3">
                    <p className="text-xs text-textcolor-secondary">{t('system.members')}</p>
                    <p className="mt-1 text-xl font-bold text-textcolor-primary">{members.length}</p>
                  </div>
                  <div className="rounded-xl bg-background-alt px-4 py-3">
                    <p className="text-xs text-textcolor-secondary">{t('system.units')}</p>
                    <p className="mt-1 text-xl font-bold text-textcolor-primary">{units.length}</p>
                  </div>
                  <div className="rounded-xl bg-background-alt px-4 py-3">
                    <p className="text-xs text-textcolor-secondary">{t('system.keys')}</p>
                    <p className="mt-1 text-xl font-bold text-textcolor-primary">{keys.length}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-2xl border border-border bg-background p-5">
                  <h3 className="mb-4 text-base font-semibold text-textcolor-primary">{t('system.units')}</h3>
                  <form action={createOrganizationUnitAction} className="grid gap-3 md:grid-cols-4">
                    <input type="hidden" name="locale" value={locale} />
                    <input type="hidden" name="orgId" value={selectedOrg.id} />
                    <input
                      name="name"
                      required
                      className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-textcolor-primary"
                      placeholder={t('system.unitName')}
                    />
                    <select
                      name="type"
                      className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-textcolor-primary"
                      defaultValue="team"
                    >
                      <option value="department">department</option>
                      <option value="lab">lab</option>
                      <option value="team">team</option>
                    </select>
                    <select
                      name="parentUnitId"
                      defaultValue=""
                      className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-textcolor-primary"
                    >
                      <option value="">{t('system.noUnit')}</option>
                      {units.map((unit) => (
                        <option key={unit.id} value={unit.id}>
                          {unit.name}
                        </option>
                      ))}
                    </select>
                    <button className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                      {t('system.addUnit')}
                    </button>
                  </form>
                  <div className="mt-4 space-y-2">
                    {units.length === 0 ? (
                      <p className="text-sm text-textcolor-secondary">{t('system.unitsEmpty')}</p>
                    ) : (
                      units.map((unit) => (
                        <div key={unit.id} className="rounded-xl border border-border px-4 py-3">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="font-medium text-textcolor-primary">{unit.name}</p>
                              <p className="mt-0.5 font-mono text-xs text-textcolor-secondary">{unit.id}</p>
                            </div>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                              {unit.type}
                            </span>
                          </div>
                          {unit.parentUnitId ? (
                            <p className="mt-2 text-xs text-textcolor-secondary">
                              {t('system.parentUnit')}: {unitNameById(units, unit.parentUnitId)}
                            </p>
                          ) : null}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-background p-5">
                  <h3 className="mb-4 text-base font-semibold text-textcolor-primary">{t('system.members')}</h3>
                  <form action={createOrganizationMemberAction} className="grid gap-3 md:grid-cols-2">
                    <input type="hidden" name="locale" value={locale} />
                    <input type="hidden" name="orgId" value={selectedOrg.id} />
                    <input
                      name="name"
                      required
                      className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-textcolor-primary"
                      placeholder={t('system.memberName')}
                    />
                    <input
                      name="email"
                      required
                      type="email"
                      className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-textcolor-primary"
                      placeholder={t('system.memberEmail')}
                    />
                    <select
                      name="role"
                      className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-textcolor-primary"
                      defaultValue="scientist"
                    >
                      <option value="owner">owner</option>
                      <option value="research_admin">research_admin</option>
                      <option value="scientist">scientist</option>
                      <option value="analyst">analyst</option>
                      <option value="reviewer">reviewer</option>
                    </select>
                    <select
                      name="unitId"
                      className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-textcolor-primary"
                      defaultValue=""
                    >
                      <option value="">{t('system.noUnit')}</option>
                      {units.map((unit) => (
                        <option key={unit.id} value={unit.id}>
                          {unit.name}
                        </option>
                      ))}
                    </select>
                    <button className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground md:col-span-2">
                      {t('system.addMember')}
                    </button>
                  </form>

                  <div className="mt-4 space-y-2">
                    {members.length === 0 ? (
                      <p className="text-sm text-textcolor-secondary">{t('system.membersEmpty')}</p>
                    ) : (
                      members.map((member) => (
                        <div key={member.id} className="rounded-xl border border-border px-4 py-3">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-medium text-textcolor-primary">{member.name}</p>
                              <p className="mt-0.5 text-sm text-textcolor-secondary">{member.email}</p>
                              <p className="mt-1 text-xs text-textcolor-secondary">
                                {t('system.assignedUnit')}: {unitNameById(units, member.unitId)}
                              </p>
                            </div>
                            <form action={updateOrganizationMemberRoleAction} className="flex items-center gap-2">
                              <input type="hidden" name="locale" value={locale} />
                              <input type="hidden" name="orgId" value={selectedOrg.id} />
                              <input type="hidden" name="memberId" value={member.id} />
                              <select
                                name="role"
                                defaultValue={member.role}
                                className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-textcolor-primary"
                              >
                                <option value="owner">owner</option>
                                <option value="research_admin">research_admin</option>
                                <option value="scientist">scientist</option>
                                <option value="analyst">analyst</option>
                                <option value="reviewer">reviewer</option>
                              </select>
                              <select
                                name="unitId"
                                defaultValue={member.unitId ?? ''}
                                className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-textcolor-primary"
                              >
                                <option value="">{t('system.noUnit')}</option>
                                {units.map((unit) => (
                                  <option key={unit.id} value={unit.id}>
                                    {unit.name}
                                  </option>
                                ))}
                              </select>
                              <button className="rounded-xl border border-border px-3 py-2 text-sm text-textcolor-primary">
                                {t('system.updateRole')}
                              </button>
                            </form>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-background p-5">
                <h3 className="mb-4 text-base font-semibold text-textcolor-primary">{t('system.apiKeys')}</h3>
                <form action={createOrganizationKeyAction} className="grid gap-3 md:grid-cols-[1fr_160px_1fr_auto]">
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="orgId" value={selectedOrg.id} />
                  <input
                    name="name"
                    required
                    className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-textcolor-primary"
                    placeholder={t('system.keyName')}
                  />
                  <input
                    name="environment"
                    defaultValue="development"
                    className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-textcolor-primary"
                    placeholder="development"
                  />
                  <input
                    name="scopes"
                    defaultValue="*"
                    className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-textcolor-primary"
                    placeholder="*"
                  />
                  <button className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                    {t('system.createKey')}
                  </button>
                </form>

                <div className="mt-4 space-y-2">
                  {keys.length === 0 ? (
                    <p className="text-sm text-textcolor-secondary">{t('system.keysEmpty')}</p>
                  ) : (
                    keys.map((key) => (
                      <div
                        key={key.id}
                        className="flex items-center justify-between gap-4 rounded-xl border border-border px-4 py-3"
                      >
                        <div>
                          <p className="font-medium text-textcolor-primary">{key.name}</p>
                          <p className="mt-0.5 font-mono text-xs text-textcolor-secondary">{key.keyPrefix}</p>
                          <p className="mt-1 text-xs text-textcolor-secondary">
                            {key.environment} · {key.scopes.join(', ')}
                          </p>
                        </div>
                        {key.revokedAt ? (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                            {t('system.revoked')}
                          </span>
                        ) : (
                          <form action={revokeOrganizationKeyAction}>
                            <input type="hidden" name="locale" value={locale} />
                            <input type="hidden" name="orgId" value={selectedOrg.id} />
                            <input type="hidden" name="keyId" value={key.id} />
                            <button className="rounded-xl border border-rose-200 px-3 py-2 text-sm text-rose-700">
                              {t('system.revokeKey')}
                            </button>
                          </form>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-background-alt px-8 py-12 text-center text-sm text-textcolor-secondary">
              {t('system.selectOrganization')}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
