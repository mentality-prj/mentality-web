'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { CustomInput } from '@/ds/components/CustomInput'
import { useRouter } from '@/i18n/navigation'
import { createCompany } from '@/requests/companies'
import { CustomSession } from '@/types/auth'
import { Button } from '@/ui/button'

export function CreateCompanyForm() {
  const { data } = useSession()
  const router = useRouter()
  const t = useTranslations('pages.Company.globalAdmin.createCompany')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError(t('errorRequired'))
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

    toast.success(t('success'))
    setName('')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <CustomInput
        id="company-name"
        label={t('nameLabel')}
        placeholder={t('namePlaceholder')}
        value={name}
        onChange={(e) => setName(e.target.value)}
        errorMsg={error ?? undefined}
        disabled={loading}
        required
      />
      <Button type="submit" disabled={loading || !name.trim()}>
        {loading ? t('submitting') : t('submitButton')}
      </Button>
    </form>
  )
}
