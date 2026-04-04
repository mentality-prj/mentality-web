'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { useAdminCompany } from '@/context/adminCompanyContext'
import { classifyInviteError, isValidEmail } from '@/helpers/company.helpers'
import { useGroups } from '@/hooks/useGroups'
import { createInvite, createInviteAdmin } from '@/requests/invites'
import { CustomSession } from '@/types/auth'
import { COMPANY_ROLES, CompanyRole } from '@/types/rbac'

type InviteRole = Extract<CompanyRole, 'employee' | 'manager'>

type UseInviteFormOptions = {
  fixedRole?: InviteRole
  onInvited?: () => void
}

export function useInviteForm(options: UseInviteFormOptions = {}) {
  const { fixedRole, onInvited } = options
  const t = useTranslations('pages.Company.companyAdmin.invite')
  const { data } = useSession()
  const { companyId: adminCompanyId } = useAdminCompany()
  const { items: groups } = useGroups()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<InviteRole>(fixedRole ?? COMPANY_ROLES.EMPLOYEE)
  const [groupIds, setGroupIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [groupError, setGroupError] = useState<string | null>(null)

  useEffect(() => {
    setGroupIds([])
    setEmailError(null)
    setGroupError(null)
  }, [adminCompanyId])

  function validate(): boolean {
    let valid = true
    if (!isValidEmail(email)) {
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
    const dto = { email: email.trim(), role, groupIds }
    const session = data as CustomSession
    const res = adminCompanyId
      ? await createInviteAdmin(session, adminCompanyId, dto)
      : await createInvite(session, dto)
    setLoading(false)

    if ('error' in res) {
      toast.error(classifyInviteError(res.error, t))
      return
    }

    toast.success(t('success', { email: email.trim() }))
    setEmail('')
    setGroupIds([])
    setRole(fixedRole ?? COMPANY_ROLES.EMPLOYEE)
    onInvited?.()
  }

  const noGroups = groups.length === 0

  return {
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
    noGroups,
    handleSubmit,
  }
}
