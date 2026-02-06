'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'

import { DropdownInput } from '@/ds/components/DropdownInput'
import { Button } from '@/ds/shadcn/button'
import { Textarea } from '@/ds/shadcn/textarea'
import { generateExercise } from '@/requests/exercises'
import { ExerciseCategory } from '@/types/api-responses'
import { CustomSession } from '@/types/auth'
import { SupportedLanguage } from '@/types/languages'
import { notifyError, notifySuccess } from '@/utils/toast'

export default function GenerateExercise() {
  const t = useTranslations('components.Admin.AddExercise')
  const locale = useLocale() as SupportedLanguage
  const { data } = useSession()
  const session = data as CustomSession

  const [prompt, setPrompt] = useState('')
  const [category, setCategory] = useState<ExerciseCategory | ''>('')
  const [isGenerating, setIsGenerating] = useState(false)

  const categories = [
    { value: 'meditation', text: t('categories.meditations') },
    { value: 'breathing', text: t('categories.breathing') },
    { value: 'calming', text: t('categories.calming') },
  ]

  const handleGenerate = async () => {
    if (!session || isGenerating) return
    if (!category) {
      notifyError(t('fields.type.required'))
      return
    }

    setIsGenerating(true)
    try {
      const { error } = await generateExercise(session, prompt ?? undefined, category, locale)
      if (error) {
        notifyError(typeof error === 'string' ? error : JSON.stringify(error))
      } else {
        notifySuccess(t('success'))
        setPrompt('')
      }
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex w-full gap-default">
      <div className="flex flex-1 flex-col gap-default">
        <DropdownInput
          id="category"
          label={t('fields.category.label')}
          placeholder={t('fields.category.required')}
          value={category}
          items={categories}
          onValueChange={(v) => setCategory(v as ExerciseCategory)}
        />

        <Textarea
          id="exercisePrompt"
          placeholder={t('promptPlaceholder')}
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          rows={4}
          disabled={isGenerating}
        />
      </div>
      <div className="flex flex-col gap-default">
        <Button size="large" variant="volume" onClick={handleGenerate} disabled={isGenerating || !category}>
          {isGenerating ? t('generating') : t('generateButton')}
        </Button>
      </div>
    </div>
  )
}
