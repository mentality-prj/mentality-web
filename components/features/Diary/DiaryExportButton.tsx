'use client'

import { Download } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { createDiaryExport } from '@/helpers/diaryExport'
import type { DiaryEntity } from '@/types/api-responses'
import { notifyError } from '@/utils/toast'

type Props = { notes: DiaryEntity[] }

/** Exports the entire user-scoped API history, including archived records. */
export function DiaryExportButton({ notes }: Props) {
  const t = useTranslations('components.Diary')

  const onExport = () => {
    if (notes.length === 0) return

    let objectUrl: string | null = null
    try {
      const payload = JSON.stringify(createDiaryExport(notes), null, 2)
      objectUrl = URL.createObjectURL(new Blob([payload], { type: 'application/json;charset=utf-8' }))
      const download = document.createElement('a')
      download.href = objectUrl
      download.download = `dzvin-diary-${new Date().toISOString().slice(0, 10)}.json`
      download.click()
    } catch {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
      notifyError(t('exportError'))
      return
    }

    // The browser needs the object URL to stay live until it processes the click.
    if (objectUrl) {
      const url = objectUrl
      setTimeout(() => URL.revokeObjectURL(url), 1_000)
    }
  }

  return (
    <button
      type="button"
      disabled={notes.length === 0}
      onClick={onExport}
      className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl border border-current px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <Download size={18} aria-hidden="true" />
      {t('exportAction')}
    </button>
  )
}
