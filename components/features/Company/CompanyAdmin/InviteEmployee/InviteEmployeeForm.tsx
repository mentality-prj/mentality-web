'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'

import { GroupSelector } from '@/components/features/Company/GroupSelector'
import { CustomInput } from '@/ds/components/CustomInput'
import { useGroups } from '@/hooks/useGroups'
import { createInvite } from '@/requests/invites'
import { CustomSession } from '@/types/auth'
import { COMPANY_ROLES, CompanyRole } from '@/types/rbac'
import { Button } from '@/ui/button'
import { Label } from '@/ui/label'

type InviteRole = Extract<CompanyRole, 'EMPLOYEE' | 'MANAGER'>

const ROLE_OPTIONS: { label: string; value: InviteRole }[] = [
  { label: 'Employee', value: COMPANY_ROLES.EMPLOYEE },
  { label: 'Manager', value: COMPANY_ROLES.MANAGER },
]

type Props = {
  onInvited?: () => void
}

export function InviteEmployeeForm({ onInvited }: Props) {
  const { data } = useSession()
  const { items: groups } = useGroups()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<InviteRole>(COMPANY_ROLES.EMPLOYEE)
  const [groupIds, setGroupIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [groupError, setGroupError] = useState<string | null>(null)

  function validate(): boolean {
    let valid = true
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('A valid email is required.')
      valid = false
    } else {
      setEmailError(null)
    }
    if (groupIds.length === 0) {
      setGroupError('Select at least one group.')
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
    const res = await createInvite(data as CustomSession, { email: email.trim(), role, groupIds })
    setLoading(false)

    if ('error' in res) {
      // Distinguish duplicate invite error
      if (res.error.includes('409') || res.error.toLowerCase().includes('duplicate')) {
        toast.error('This user has already been invited.')
      } else {
        toast.error(res.error)
      }
      return
    }

    toast.success(`Invite sent to ${email.trim()}.`)
    setEmail('')
    setGroupIds([])
    setRole(COMPANY_ROLES.EMPLOYEE)
    onInvited?.()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <CustomInput
        id="invite-email"
        label="Email"
        type="email"
        placeholder="employee@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        errorMsg={emailError ?? undefined}
        disabled={loading}
        required
      />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="invite-role">Role</Label>
        <select
          id="invite-role"
          value={role}
          onChange={(e) => setRole(e.target.value as InviteRole)}
          className="border-input focus-visible:ring-ring rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1"
          disabled={loading}
        >
          {ROLE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Groups</Label>
        <GroupSelector groups={groups} selected={groupIds} onChange={setGroupIds} />
        {groupError && <p className="text-destructive text-xs">{groupError}</p>}
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Sending…' : 'Send Invite'}
      </Button>
    </form>
  )
}
