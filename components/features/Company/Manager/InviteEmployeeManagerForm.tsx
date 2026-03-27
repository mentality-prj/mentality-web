'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'

import { GroupSelector } from '@/components/features/Company/GroupSelector'
import { CustomInput } from '@/ds/components/CustomInput'
import { useGroups } from '@/hooks/useGroups'
import { createInvite } from '@/requests/invites'
import { CustomSession } from '@/types/auth'
import { COMPANY_ROLES } from '@/types/rbac'
import { Button } from '@/ui/button'
import { Label } from '@/ui/label'

type Props = {
  onInvited?: () => void
}

export function InviteEmployeeManagerForm({ onInvited }: Props) {
  const { data } = useSession()
  // Managers can only invite to their accessible groups
  const { items: groups } = useGroups(true)
  const [email, setEmail] = useState('')
  const [groupIds, setGroupIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [groupError, setGroupError] = useState<string | null>(null)

  const noGroups = groups.length === 0

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
    const res = await createInvite(data as CustomSession, {
      email: email.trim(),
      role: COMPANY_ROLES.EMPLOYEE,
      groupIds,
    })
    setLoading(false)

    if ('error' in res) {
      if (res.error.includes('409') || res.error.toLowerCase().includes('duplicate')) {
        toast.error('This user has already been invited.')
      } else if (res.error.toLowerCase().includes('already in company')) {
        toast.error('This user is already a member of the company.')
      } else {
        toast.error(res.error)
      }
      return
    }

    toast.success(`Invite sent to ${email.trim()}.`)
    setEmail('')
    setGroupIds([])
    onInvited?.()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <CustomInput
        id="manager-invite-email"
        label="Email"
        type="email"
        placeholder="employee@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        errorMsg={emailError ?? undefined}
        disabled={loading || noGroups}
        required
      />

      <div className="flex flex-col gap-1.5">
        <Label>Groups</Label>
        {noGroups ? (
          <p className="text-sm text-textcolor-secondary">You have no accessible groups. Contact your admin.</p>
        ) : (
          <>
            <GroupSelector groups={groups} selected={groupIds} onChange={setGroupIds} />
            {groupError && <p className="text-destructive text-xs">{groupError}</p>}
          </>
        )}
      </div>

      <Button type="submit" disabled={loading || noGroups}>
        {loading ? 'Sending…' : 'Invite Employee'}
      </Button>
    </form>
  )
}
