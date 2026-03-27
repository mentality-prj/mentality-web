'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'

import { CustomInput } from '@/ds/components/CustomInput'
import { createCompany } from '@/requests/companies'
import { CustomSession } from '@/types/auth'
import { CompanyEntity } from '@/types/company'
import { Button } from '@/ui/button'

type Props = {
  onCreated?: (company: CompanyEntity) => void
}

export function CreateCompanyForm({ onCreated }: Props) {
  const { data } = useSession()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Company name is required.')
      return
    }

    setLoading(true)
    setError(null)

    const res = await createCompany(data as CustomSession, { name: trimmed })

    setLoading(false)

    if ('error' in res) {
      setError(res.error)
      toast.error(res.error)
      return
    }

    toast.success(`Company "${res.data.name}" created.`)
    setName('')
    onCreated?.(res.data)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <CustomInput
        id="company-name"
        label="Company name"
        placeholder="Acme Corp"
        value={name}
        onChange={(e) => setName(e.target.value)}
        errorMsg={error ?? undefined}
        disabled={loading}
        required
      />
      <Button type="submit" disabled={loading || !name.trim()}>
        {loading ? 'Creating…' : 'Create Company'}
      </Button>
    </form>
  )
}
