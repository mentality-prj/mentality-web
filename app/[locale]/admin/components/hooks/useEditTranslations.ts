import { useCallback, useState } from 'react'

import { SupportedLanguage, supportedLanguages } from '@/types/languages'

interface EditableEntity {
  id: string | number
  translations?: Record<string, string>
}

export function useEditTranslations<T extends EditableEntity>(initialLocale: SupportedLanguage) {
  const [editingEntity, setEditingEntity] = useState<T | null>(null)
  const [activeLang, setActiveLang] = useState<SupportedLanguage>(initialLocale)
  const [translationsState, setTranslationsState] = useState<Record<SupportedLanguage, string>>(() => {
    const initial = {} as Record<SupportedLanguage, string>
    supportedLanguages.forEach((lang) => {
      initial[lang as SupportedLanguage] = ''
    })
    return initial
  })

  const startEditing = useCallback((entity: T) => {
    setEditingEntity(entity)
    const initialTranslations = {} as Record<SupportedLanguage, string>
    supportedLanguages.forEach((l) => {
      initialTranslations[l as SupportedLanguage] =
        (entity.translations as Record<SupportedLanguage, string>)?.[l as SupportedLanguage] || ''
    })
    setTranslationsState(initialTranslations)
  }, [])

  const handleCancel = useCallback(() => {
    setEditingEntity(null)
    setTranslationsState((prev) => {
      const cleared = { ...prev }
      supportedLanguages.forEach((lang) => (cleared[lang as SupportedLanguage] = ''))
      return cleared
    })
  }, [])

  const getUpdatedTranslations = useCallback(() => {
    const updatedTranslations = { ...(editingEntity?.translations || {}) } as Record<string, string>
    supportedLanguages.forEach((l) => {
      updatedTranslations[l as SupportedLanguage] = translationsState[l as SupportedLanguage]
    })
    return updatedTranslations
  }, [editingEntity, translationsState])

  const clearTranslations = useCallback(() => {
    setTranslationsState((prev) => {
      const cleared = { ...prev }
      supportedLanguages.forEach((lang) => (cleared[lang as SupportedLanguage] = ''))
      return cleared
    })
  }, [])

  return {
    editingEntity,
    setEditingEntity,
    translationsState,
    setTranslationsState,
    activeLang,
    setActiveLang,
    startEditing,
    handleCancel,
    getUpdatedTranslations,
    clearTranslations,
  }
}
