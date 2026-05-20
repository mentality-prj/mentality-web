'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

import { Badge } from '@/ui/badge'
import { Button } from '@/ui/button'
import { Checkbox } from '@/ui/checkbox'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'

type Props = {
  label: string
  values: string[]
  onChange: (values: string[]) => void
  options?: string[]
  disabled?: boolean
  placeholder?: string
}

export function ResearchMultiSelectField({
  label,
  values,
  onChange,
  options = [],
  disabled = false,
  placeholder,
}: Props) {
  const t = useTranslations('pages.Research')
  const [draftValue, setDraftValue] = useState('')
  const mergedOptions = Array.from(new Set([...options, ...values])).filter(Boolean)
  const placeholderText = placeholder || t('panels.multiSelect.placeholder')

  function toggleValue(nextValue: string) {
    if (disabled) {
      return
    }

    onChange(values.includes(nextValue) ? values.filter((item) => item !== nextValue) : [...values, nextValue])
  }

  function addDraftValue() {
    const trimmedValue = draftValue.trim()
    if (!trimmedValue || values.includes(trimmedValue) || disabled) {
      return
    }

    onChange([...values, trimmedValue])
    setDraftValue('')
  }

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      {values.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {values.map((value) => (
            <Badge key={value} variant="secondary" className="gap-2">
              {value}
              {!disabled ? (
                <button type="button" onClick={() => toggleValue(value)} className="text-xs">
                  x
                </button>
              ) : null}
            </Badge>
          ))}
        </div>
      ) : null}

      <div className="flex gap-2">
        <Input
          value={draftValue}
          onChange={(event) => setDraftValue(event.target.value)}
          placeholder={placeholderText}
          disabled={disabled}
        />
        <Button type="button" variant="secondary" onClick={addDraftValue} disabled={disabled || !draftValue.trim()}>
          {t('common.add')}
        </Button>
      </div>

      {mergedOptions.length > 0 ? (
        <div className="grid gap-2 md:grid-cols-2">
          {mergedOptions.map((option) => (
            <label key={option} className="flex items-center gap-3 rounded-2xl border border-border px-4 py-3">
              <Checkbox
                checked={values.includes(option)}
                onCheckedChange={() => toggleValue(option)}
                disabled={disabled}
              />
              <span className="text-sm text-textcolor-primary">{option}</span>
            </label>
          ))}
        </div>
      ) : null}
    </div>
  )
}
