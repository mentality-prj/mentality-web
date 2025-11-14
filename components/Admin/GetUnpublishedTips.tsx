import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { Button } from '@/ds/shadcn/button'
import { Label } from '@/ds/shadcn/label'
import { Textarea } from '@/ds/shadcn/textarea'
import { addTip, getUnpublishedTips } from '@/requests/tips'
import { CustomSession } from '@/types/auth'
import { SupportedLanguage } from '@/types/languages'
import { notifyError, notifySuccess } from '@/utils/toast'

export default function AddTip() {
  const t = useTranslations('components.Admin.GenerateTip')
  const [lang] = useState<SupportedLanguage>('uk')
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { data } = useSession()
  const session = data as CustomSession

  const generateTip = async () => {
    if (session?.user) {
      setIsLoading(true)
      try {
        const result = await addTip(session, prompt, lang)
        if (result.error) {
          notifyError(result.error)
        } else {
          notifySuccess(t('success'))
        }
      } finally {
        setIsLoading(false)
      }
    }
    return
  }

  const showUnpublishedTips = async () => {
    if (session?.user) {
      setIsLoading(true)
      try {
        const result = await getUnpublishedTips(session)
        if (result.error) {
          notifyError(result.error)
        } else if (result.data) {
          notifySuccess(t('unpublishedSuccess', { count: result.data.length }))
        }
      } finally {
        setIsLoading(false)
      }
    }
    return
  }

  return (
    <>
      <div className="flex w-full gap-6 px-6 py-6">
        <div className="flex flex-col gap-6">
          <Button color="success" onClick={generateTip} disabled={isLoading}>
            {t('generateButton')}
          </Button>
          <Button color="primary" onClick={showUnpublishedTips} disabled={isLoading}>
            {t('showUnpublishedButton')}
          </Button>
        </div>
        <p className="text-sm">
          Generate a <strong>Tip</strong> using the OpenAI service.
          <br />
          This tip will automatically appear on pages as a <strong>Current Tip</strong>
          <br />
          <em>If no prompt is specified, the tip will be generated with the default prompt.</em>
        </p>
      </div>
      <div className="mt-8 flex w-full gap-6 px-6 py-6">
        <em>
          Генерація поради підтримує лише <strong>українську мову</strong>
        </em>
        <Label htmlFor="tipPrompt">Tip Prompt</Label>
        <Textarea
          id="tipPrompt"
          placeholder={t('promptPlaceholder')}
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          disabled={isLoading}
        />
      </div>
    </>
  )
}
