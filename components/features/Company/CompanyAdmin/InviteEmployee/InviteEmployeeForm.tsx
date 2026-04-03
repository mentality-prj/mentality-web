'use client'

import { useTranslations } from 'next-intl'

import { GroupSelector } from '@/components/features/Company/GroupSelector'
import { INVITE_ROLE_VALUES, InviteRole } from '@/constants/company'
import { CustomInput } from '@/ds/components/CustomInput'
import { useInviteForm } from '@/hooks/useInviteForm'
import { Button } from '@/ui/button'
import { Label } from '@/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'

type Props = {
  onInvited?: () => void
}

export function InviteEmployeeForm({ onInvited }: Props) {
  const t = useTranslations('pages.Company.companyAdmin.invite')
  const tRoles = useTranslations('pages.Company.roles')
  const {
    groups,
    email,
    setEmail,
    role,
    setRole,
    groupIds,
    setGroupIds,
    loading,
    emailError,
    groupError,
    handleSubmit,
  } = useInviteForm({ onInvited })

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <CustomInput
        id="invite-email"
        label={t('emailLabel')}
        type="email"
        placeholder={t('emailPlaceholder')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        errorMsg={emailError ?? undefined}
        disabled={loading}
        required
      />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="invite-role">{t('roleLabel')}</Label>
        <Select value={role} onValueChange={(v) => setRole(v as InviteRole)} disabled={loading}>
          <SelectTrigger id="invite-role">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {INVITE_ROLE_VALUES.map((v) => (
              <SelectItem key={v} value={v}>
                {tRoles(v)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>{t('groupsLabel')}</Label>
        <GroupSelector groups={groups} selected={groupIds} onChange={setGroupIds} />
        {groupError && <p className="text-destructive text-xs">{groupError}</p>}
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? t('submitting') : t('submitButton')}
      </Button>
    </form>
  )
}
