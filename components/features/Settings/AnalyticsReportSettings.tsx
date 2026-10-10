'use client'

import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'

import { ISO_WEEKDAYS } from '@/constants/userStatistics'
import { useAuth } from '@/context/AuthProvider'
import { getAnalyticsPreferences, updateAnalyticsPreferences } from '@/requests/analytics'
import { AnalyticsPreferences } from '@/types/company'
import { Button } from '@/ui/button'
import { Label } from '@/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'

function formatDateTime(value: string, locale: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function isCooldownActive(nextAllowedUpdateAt: string | null): boolean {
  if (!nextAllowedUpdateAt) return false

  const nextAllowedDate = new Date(nextAllowedUpdateAt)
  if (Number.isNaN(nextAllowedDate.getTime())) return false

  return Date.now() < nextAllowedDate.getTime()
}

export function AnalyticsReportSettings() {
  const t = useTranslations('pages.Settings.report')
  const locale = useLocale()
  const { session, status } = useAuth()

  const [preferences, setPreferences] = useState<AnalyticsPreferences | null>(null)
  const [selectedDay, setSelectedDay] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (status !== 'authenticated') {
      if (status !== 'loading') setLoading(false)
      return
    }

    let isActive = true

    async function loadPreferences() {
      setLoading(true)
      setError(null)

      const result = await getAnalyticsPreferences(session)
      if (!isActive) return

      if ('error' in result) {
        setError(result.error)
        setLoading(false)
        return
      }

      setPreferences(result.data)
      setSelectedDay(String(result.data.sprintAnchorDay))
      setLoading(false)
    }

    void loadPreferences()

    return () => {
      isActive = false
    }
  }, [session, status])

  const nextAllowedUpdateAt = preferences?.nextAllowedUpdateAt ?? null
  const cooldownActive = isCooldownActive(nextAllowedUpdateAt)
  const hasChanged = selectedDay !== '' && selectedDay !== String(preferences?.sprintAnchorDay ?? '')
  const formattedNextAllowedUpdateAt = nextAllowedUpdateAt ? formatDateTime(nextAllowedUpdateAt, locale) : null

  async function handleSave() {
    if (!selectedDay) return

    setSaving(true)
    setError(null)
    setSuccess(null)

    const result = await updateAnalyticsPreferences(session, { sprintAnchorDay: Number(selectedDay) })

    if ('error' in result) {
      if (result.status === 400) {
        setError(t('cooldownError', { date: formatDateTime(result.error, locale) }))
        setPreferences((prev) => (prev ? { ...prev, nextAllowedUpdateAt: result.error } : prev))
      } else {
        setError(result.error)
      }
      setSaving(false)
      return
    }

    setPreferences(result.data)
    setSelectedDay(String(result.data.sprintAnchorDay))
    setSuccess(t('saved'))
    setSaving(false)
  }

  if (loading) {
    return <p className="text-sm text-textcolor-secondary">{t('loading')}</p>
  }

  if (!preferences) {
    return error ? <p className="text-destructive text-sm">{error}</p> : null
  }

  return (
    <section className="flex w-full flex-col gap-4 rounded-2xl border border-border bg-background p-6 shadow-sm">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-textcolor-primary">{t('title')}</h2>
        <p className="text-sm text-textcolor-secondary">{t('description')}</p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="analytics-report-day">{t('dayLabel')}</Label>
        <Select value={selectedDay} onValueChange={setSelectedDay}>
          <SelectTrigger id="analytics-report-day">
            <SelectValue placeholder={t('placeholder')} />
          </SelectTrigger>
          <SelectContent>
            {ISO_WEEKDAYS.map((day) => (
              <SelectItem key={day} value={String(day)}>
                {t(`weekday.${day}` as const)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl bg-background-soft p-4 text-sm text-textcolor-secondary">
        {cooldownActive && formattedNextAllowedUpdateAt
          ? t('nextAllowed', { date: formattedNextAllowedUpdateAt })
          : t('nextAllowedNow')}
      </div>

      {cooldownActive && formattedNextAllowedUpdateAt && (
        <p className="text-sm text-amber-700">{t('saveBlocked', { date: formattedNextAllowedUpdateAt })}</p>
      )}

      {error && <p className="text-destructive text-sm">{error}</p>}
      {success && <p className="text-sm text-green-700">{success}</p>}

      <div className="flex justify-start">
        <Button type="button" onClick={handleSave} disabled={saving || cooldownActive || !hasChanged || !selectedDay}>
          {saving ? t('saving') : t('save')}
        </Button>
      </div>
    </section>
  )
}
