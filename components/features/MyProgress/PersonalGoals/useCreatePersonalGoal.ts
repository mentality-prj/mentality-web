import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import type { PersonalGoal } from '@/requests/personalGoals'
import { createPersonalGoal } from '@/requests/personalGoals'
import { notifyError, notifySuccess } from '@/utils/toast'

export const useCreatePersonalGoal = () => {
  const { data: session } = useSession()
  const t = useTranslations('components.PersonalGoals.CreatePersonalGoals')
  const [loading, setLoading] = useState(false)

  const create = async (text: string, repeat = 1): Promise<{ data?: PersonalGoal; error?: string }> => {
    if (!session?.user?.id) {
      notifyError(t('Toast.Failed'))
      return { error: 'no-session' }
    }

    if (text.trim().length === 0) {
      notifyError(t('Validation.Empty'))
      return { error: 'empty' }
    }

    setLoading(true)
    try {
      const res = await createPersonalGoal(session, { text, repeat })
      if ('error' in res) {
        notifyError(t('Toast.Failed'))
        return { error: 'api' }
      }
      notifySuccess(t('Toast.Created'))
      return { data: res.data }
    } finally {
      setLoading(false)
    }
  }

  return { create, loading }
}

export default useCreatePersonalGoal
