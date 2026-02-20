import { useCallback, useEffect, useMemo, useState } from 'react'

import type { ExerciseEntity, ExerciseEntityTranslations } from '@/types/api-responses'
import type { SupportedLanguage } from '@/types/languages'
import { supportedLanguages } from '@/types/languages'

const makeEmpty = (): ExerciseEntityTranslations => {
  const makeLangRecord = (): Record<SupportedLanguage, string> => {
    const r = {} as Record<SupportedLanguage, string>
    supportedLanguages.forEach((l) => {
      r[l as SupportedLanguage] = ''
    })
    return r
  }

  return {
    title: makeLangRecord(),
    annotation: makeLangRecord(),
    description: makeLangRecord(),
  }
}

export function useExerciseTranslations(editing: ExerciseEntity | null, localeKey: SupportedLanguage) {
  // Internal canonical (field-first) storage:
  const [translationsState, setTranslationsState] = useState<ExerciseEntityTranslations>(() => makeEmpty())
  const [activeLang, setActiveLang] = useState<SupportedLanguage>(localeKey)

  const setTranslationField = useCallback(
    (lang: SupportedLanguage, field: keyof ExerciseEntityTranslations, value: string) => {
      setTranslationsState((prev) => ({
        ...prev,
        [field]: { ...(prev[field as keyof ExerciseEntityTranslations] ?? {}), [lang]: value },
      }))
    },
    []
  )

  const resetTranslations = useCallback(() => {
    setTranslationsState(makeEmpty())
    setActiveLang(localeKey)
  }, [localeKey])

  useEffect(() => {
    if (editing) {
      const existing = editing.translations
      const next = makeEmpty()

      supportedLanguages.forEach((l) => {
        next.title[l as SupportedLanguage] = existing?.title?.[l as SupportedLanguage] ?? ''
        next.annotation[l as SupportedLanguage] = existing?.annotation?.[l as SupportedLanguage] ?? ''
        next.description[l as SupportedLanguage] = existing?.description?.[l as SupportedLanguage] ?? ''
      })

      setTranslationsState(next)
      setActiveLang(localeKey)
    } else {
      resetTranslations()
    }
  }, [editing, localeKey, resetTranslations])

  // Derived language-first view for UI consumers:
  const translationsByLang = useMemo(() => {
    const byLang = {} as Record<SupportedLanguage, { title: string; annotation: string; description: string }>
    supportedLanguages.forEach((l) => {
      byLang[l as SupportedLanguage] = {
        title: translationsState.title?.[l as SupportedLanguage] ?? '',
        annotation: translationsState.annotation?.[l as SupportedLanguage] ?? '',
        description: translationsState.description?.[l as SupportedLanguage] ?? '',
      }
    })
    return byLang
  }, [translationsState])

  return {
    translationsState,
    translationsByLang,
    setTranslationField,
    resetTranslations,
    activeLang,
    setActiveLang,
  }
}

export default useExerciseTranslations
