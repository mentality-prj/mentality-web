'use client'

import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { GroupSelector } from '@/components/features/Company/GroupSelector'
import { adminCreateInvite, adminGetGroups } from '@/requests/companyAdmin'
import { CustomSession } from '@/types/auth'
import { GroupEntity } from '@/types/company'
import { COMPANY_ROLES, CompanyRole } from '@/types/rbac'
import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'

type InviteRole = Extract<CompanyRole, 'employee' | 'manager'>

const INVITE_ROLE_VALUES: InviteRole[] = [COMPANY_ROLES.EMPLOYEE, COMPANY_ROLES.MANAGER]

type Props = {
  companyId: string
  onInvited?: () => void
}

export function AdminInviteEmployeeForm({ companyId, onInvited }: Props) {
  const { data, status } = useSession()
  const t = useTranslations('pages.Company.companyAdmin.invite')
  const tRoles = useTranslations('pages.Company.roles')
  const [groups, setGroups] = useState<GroupEntity[]>([])
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<InviteRole>(COMPANY_ROLES.EMPLOYEE)
  const [groupIds, setGroupIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [groupError, setGroupError] = useState<string | null>(null)

  const fetchGroups = useCallback(async () => {
    const res = await adminGetGroups(data as CustomSession, companyId)
    if (!('error' in res)) setGroups(res.data)
  }, [data, companyId])

  useEffect(() => {
    if (status === 'authenticated') fetchGroups()
  }, [fetchGroups, status])

  function validate(): boolean {
    let valid = true
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(t('errorEmail'))
      valid = false
    } else {
      setEmailError(null)
    }
    if (groupIds.length === 0) {
      setGroupError(t('errorGroups'))
      valid = false
    } else {
      setGroupError(null)
    }
    return valid
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    const res = await adminCreateInvite(data as CustomSession, companyId, { email: email.trim(), role, groupIds })
    setLoading(false)

    if ('error' in res) {
      const errorLower = res.error.toLowerCase()
      if (res.error.includes('409') || errorLower.includes('duplicate')) {
        toast.error(t('errorDuplicate'))
      } else if (errorLower.includes('already in company')) {
        toast.error(t('errorAlreadyMember'))
      } else {
        toast.error(res.error)
      }
      return
    }

    toast.success(t('success', { email: email.trim() }))
    setEmail('')
    setGroupIds([])
    setRole(COMPANY_ROLES.EMPLOYEE)
    onInvited?.()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="admin-invite-email">{t('emailLabel')}</Label>
        <Input
          id="admin-invite-email"
          type="email"
          placeholder={t('emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
          className="bg-white"
        />
        {emailError && <p className="text-destructive text-xs">{emailError}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="admin-invite-role">{t('roleLabel')}</Label>
        <Select value={role} onValueChange={(v) => setRole(v as InviteRole)} disabled={loading}>
          <SelectTrigger id="admin-invite-role">
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
