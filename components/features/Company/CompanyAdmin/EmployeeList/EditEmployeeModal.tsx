'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

import { GroupSelector } from '@/components/features/Company/GroupSelector'
import CloseIconButton from '@/components/shared/Buttons/CloseIconButton'
import FormCard from '@/components/shared/Cards/FormCard'
import { ModalSheet } from '@/components/shared/FullScreenContainers/ModalSheet'
import { GroupEntity } from '@/types/company'
import { COMPANY_ROLES, CompanyRole } from '@/types/rbac'
import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'

type Props = {
  employeeId: string
  employeeName: string
  currentRole: CompanyRole
  currentGroupIds: string[]
  currentGradeId?: string
  currentSalaryEur?: number | null
  groups: GroupEntity[]
  onSave: (
    id: string,
    dto: { role: CompanyRole; groupIds: string[]; gradeId?: string | null; avgAnnualSalaryEur?: number | null }
  ) => Promise<boolean>
  onClose: () => void
}

export function EditEmployeeModal({
  employeeId,
  employeeName,
  currentRole,
  currentGroupIds,
  currentGradeId,
  currentSalaryEur,
  groups,
  onSave,
  onClose,
}: Props) {
  const t = useTranslations('pages.Company.companyAdmin.employees')
  const tRoles = useTranslations('pages.Company.roles')

  const [role, setRole] = useState<CompanyRole>(currentRole)
  const [groupIds, setGroupIds] = useState<string[]>(currentGroupIds)
  const [gradeId, setGradeId] = useState<string>(currentGradeId ?? '')
  const [salaryEur, setSalaryEur] = useState<string>(
    typeof currentSalaryEur === 'number' && Number.isFinite(currentSalaryEur) ? String(currentSalaryEur) : ''
  )
  const [loading, setLoading] = useState(false)
  const [groupError, setGroupError] = useState<string | null>(null)
  const [salaryError, setSalaryError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (groupIds.length === 0) {
      setGroupError(t('errorGroups'))
      return
    }
    setGroupError(null)

    const parsedSalary = salaryEur.trim() === '' ? null : Number(salaryEur)
    if (parsedSalary != null && (!Number.isFinite(parsedSalary) || parsedSalary < 0)) {
      setSalaryError(t('errorSalary'))
      return
    }
    setSalaryError(null)

    setLoading(true)
    const saved = await onSave(employeeId, {
      role,
      groupIds,
      gradeId: gradeId.trim() === '' ? null : gradeId.trim(),
      avgAnnualSalaryEur: parsedSalary,
    })
    setLoading(false)
    if (saved) {
      onClose()
    }
  }

  return (
    <ModalSheet labelledBy="edit-employee-modal-title" onClose={onClose}>
      <FormCard
        className="flex max-h-[90dvh] flex-col overflow-hidden"
        childrenClassName="flex min-h-0 flex-1 flex-col"
        title={
          <span id="edit-employee-modal-title">
            {t('editTitle')} — {employeeName}
          </span>
        }
        tools={<CloseIconButton onClick={onClose} />}
      >
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col gap-4">
          <div className="scrollbar-styled min-h-0 space-y-4 overflow-y-auto pr-1">
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
              <Label htmlFor="edit-employee-grade">{t('columns.grade')}</Label>
              <Input
                id="edit-employee-grade"
                value={gradeId}
                onChange={(e) => setGradeId(e.target.value)}
                disabled={loading}
                placeholder={t('gradePlaceholder')}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-employee-salary">{t('columns.salary')}</Label>
              <Input
                id="edit-employee-salary"
                type="number"
                min={0}
                step={100}
                value={salaryEur}
                onChange={(e) => setSalaryEur(e.target.value)}
                disabled={loading}
                placeholder={t('salaryPlaceholder')}
              />
              {salaryError && <p className="text-destructive text-xs">{salaryError}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>{t('groupsLabel')}</Label>
              <GroupSelector groups={groups} selected={groupIds} onChange={setGroupIds} />
              {groupError && <p className="text-destructive text-xs">{groupError}</p>}
            </div>
          </div>

          <div className="flex shrink-0 justify-end gap-2 pt-1">
            <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
              {t('cancelButton')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t('saving') : t('saveButton')}
            </Button>
          </div>
        </form>
      </FormCard>
    </ModalSheet>
  )
}
