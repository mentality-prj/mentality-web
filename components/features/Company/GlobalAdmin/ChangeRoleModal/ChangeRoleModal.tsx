'use client'

import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { GroupSelector } from '@/components/features/Company/GroupSelector'
import CloseIconButton from '@/components/shared/Buttons/CloseIconButton'
import FormCard from '@/components/shared/Cards/FormCard'
import FullScreenCard from '@/components/shared/Cards/FullScreenCard'
import { adminAssignRole, adminGetGroups } from '@/requests/companyAdmin'
import { CustomSession } from '@/types/auth'
import { EmployeeEntity, GroupEntity } from '@/types/company'
import { COMPANY_ROLES, CompanyRole } from '@/types/rbac'
import { Label } from '@/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'

const ROLE_VALUES: CompanyRole[] = [COMPANY_ROLES.EMPLOYEE, COMPANY_ROLES.MANAGER, COMPANY_ROLES.SUPERUSER]

type Props = {
  employee: EmployeeEntity
  companyId: string
  onClose: () => void
  onSuccess: (updated: EmployeeEntity) => void
}

export function ChangeRoleModal({ employee, companyId, onClose, onSuccess }: Props) {
  const t = useTranslations('pages.Company.globalAdmin.companyDetail.changeRole')
  const tRoles = useTranslations('pages.Company.roles')
  const { data, status } = useSession()
  const [role, setRole] = useState<CompanyRole>(employee.role)
  const [groupIds, setGroupIds] = useState<string[]>(employee.groupIds)
  const [groups, setGroups] = useState<GroupEntity[]>([])
  const [groupError, setGroupError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchGroups = useCallback(async () => {
    const res = await adminGetGroups(data as CustomSession, companyId)
    if (!('error' in res)) setGroups(res.data)
  }, [data, companyId])

  useEffect(() => {
    if (status === 'authenticated') fetchGroups()
    else if (status === 'unauthenticated') setGroups([])
  }, [fetchGroups, status])

  function validate(): boolean {
    if (role === COMPANY_ROLES.MANAGER && groupIds.length === 0) {
      setGroupError(t('errorGroups'))
      return false
    }
    setGroupError(null)
    return true
  }

  async function handleSubmit() {
    if (!validate()) return
    setLoading(true)
    const dto = role === COMPANY_ROLES.MANAGER ? { companyRole: role, groupIds } : { companyRole: role }
    const res = await adminAssignRole(data as CustomSession, companyId, employee.id, dto)
    setLoading(false)
    if ('error' in res) {
      toast.error(res.error)
      return
    }
    toast.success(t('success'))
    onSuccess(res.data)
    onClose()
  }

  return (
    <FullScreenCard type="small" onClose={onClose} tools={<CloseIconButton onClick={onClose} />}>
      <FormCard
        title={t('title')}
        onSubmit={handleSubmit}
        onCancel={onClose}
        submitLabel={loading ? t('submitting') : t('submitButton')}
        cancelLabel={t('cancel')}
        submitDisabled={loading}
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-textcolor-secondary">{employee.name || employee.email}</p>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="change-role-select">{t('roleLabel')}</Label>
            <Select
              value={role}
              onValueChange={(v) => {
                setRole(v as CompanyRole)
                setGroupError(null)
              }}
              disabled={loading}
            >
              <SelectTrigger id="change-role-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLE_VALUES.map((v) => (
                  <SelectItem key={v} value={v}>
                    {tRoles(v)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {role === COMPANY_ROLES.MANAGER && (
            <div className="flex flex-col gap-1.5">
              <Label>{t('groupsLabel')}</Label>
              <GroupSelector groups={groups} selected={groupIds} onChange={setGroupIds} />
              {groupError && <p className="text-destructive text-xs">{groupError}</p>}
            </div>
          )}
        </div>
      </FormCard>
    </FullScreenCard>
  )
}
