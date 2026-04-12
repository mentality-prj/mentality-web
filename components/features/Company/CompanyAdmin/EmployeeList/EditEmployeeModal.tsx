'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

import { GroupSelector } from '@/components/features/Company/GroupSelector'
import CloseIconButton from '@/components/shared/Buttons/CloseIconButton'
import FormCard from '@/components/shared/Cards/FormCard'
import FullScreenBackdrop from '@/components/shared/FullScreenContainers/FullScreenBackdrop/FullScreenBackdrop'
import { GroupEntity } from '@/types/company'
import { COMPANY_ROLES, CompanyRole } from '@/types/rbac'
import { Button } from '@/ui/button'
import { Label } from '@/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'

type Props = {
  employeeId: string
  employeeName: string
  currentRole: CompanyRole
  currentGroupIds: string[]
  groups: GroupEntity[]
  onSave: (id: string, dto: { role: CompanyRole; groupIds: string[] }) => Promise<boolean>
  onClose: () => void
}

export function EditEmployeeModal({
  employeeId,
  employeeName,
  currentRole,
  currentGroupIds,
  groups,
  onSave,
  onClose,
}: Props) {
  const t = useTranslations('pages.Company.companyAdmin.employees')
  const tRoles = useTranslations('pages.Company.roles')

  const [role, setRole] = useState<CompanyRole>(currentRole)
  const [groupIds, setGroupIds] = useState<string[]>(currentGroupIds)
  const [loading, setLoading] = useState(false)
  const [groupError, setGroupError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (groupIds.length === 0) {
      setGroupError(t('errorGroups'))
      return
    }
    setGroupError(null)
    setLoading(true)
    await onSave(employeeId, { role, groupIds })
    setLoading(false)
    onClose()
  }

  return (
    <>
      <FullScreenBackdrop onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-employee-modal-title"
        className="scrollbar-styled fixed inset-x-4 top-1/2 z-50 max-h-[90vh] -translate-y-1/2 overflow-y-auto md:inset-x-auto md:left-1/2 md:w-[520px] md:-translate-x-1/2"
      >
        <FormCard
          title={
            <span id="edit-employee-modal-title">
              {t('editTitle')} — {employeeName}
            </span>
          }
          tools={<CloseIconButton onClick={onClose} />}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-employee-role">{t('roleLabel')}</Label>
              <Select value={role} onValueChange={(v) => setRole(v as CompanyRole)} disabled={loading}>
                <SelectTrigger id="edit-employee-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={COMPANY_ROLES.EMPLOYEE}>{tRoles(COMPANY_ROLES.EMPLOYEE)}</SelectItem>
                  <SelectItem value={COMPANY_ROLES.MANAGER}>{tRoles(COMPANY_ROLES.MANAGER)}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>{t('groupsLabel')}</Label>
              <GroupSelector groups={groups} selected={groupIds} onChange={setGroupIds} />
              {groupError && <p className="text-destructive text-xs">{groupError}</p>}
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? t('saving') : t('saveButton')}
              </Button>
            </div>
          </form>
        </FormCard>
      </div>
    </>
  )
}
