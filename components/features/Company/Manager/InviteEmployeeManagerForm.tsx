'use client'

import { useTranslations } from 'next-intl'

import { GroupSelector } from '@/components/features/Company/GroupSelector'
import { CustomInput } from '@/ds/components/CustomInput'
import { useInviteForm } from '@/hooks/useInviteForm'
import { COMPANY_ROLES } from '@/types/rbac'
import { Button } from '@/ui/button'
import { Label } from '@/ui/label'

type Props = {
  onInvited?: () => void
}

export function InviteEmployeeManagerForm({ onInvited }: Props) {
  const t = useTranslations('pages.Company.companyAdmin.invite')
  const tManager = useTranslations('pages.Company.manager.invite')
  const {
    groups,
    email,
    setEmail,
    groupIds,
    setGroupIds,
    loading,
    emailError,
    groupError,
    noGroups,
    isReady,
    handleSubmit,
  } = useInviteForm({
    fixedRole: COMPANY_ROLES.EMPLOYEE,
    onInvited,
  })

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <CustomInput
        id="manager-invite-email"
        label={t('emailLabel')}
        type="email"
        placeholder={t('emailPlaceholder')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        errorMsg={emailError ?? undefined}
        disabled={loading || noGroups || !isReady}
        required
      />

      <div className="flex flex-col gap-1.5">
        <Label>{t('groupsLabel')}</Label>
        {noGroups ? (
          <p className="text-sm text-textcolor-secondary">{tManager('noGroups')}</p>
        ) : (
          <>
            <GroupSelector groups={groups} selected={groupIds} onChange={setGroupIds} />
            {groupError && <p className="text-destructive text-xs">{groupError}</p>}
          </>
        )}
      </div>

      <Button type="submit" disabled={loading || noGroups || !isReady}>
        {loading ? t('submitting') : t('submitButton')}
      </Button>
    </form>
  )
}
