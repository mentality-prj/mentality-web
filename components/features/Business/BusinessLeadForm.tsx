'use client'

import { type FormEvent, useRef, useState } from 'react'
import Script from 'next/script'
import { useTranslations } from 'next-intl'
import { z } from 'zod'

import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/navigation'
import { createLeadSubmissionId } from '@/lib/contact/createLeadSubmissionId'
import { type BusinessContactFormPayload, sendBusinessContactForm } from '@/requests/contact'
import { Button } from '@/ui/button'
import { Checkbox } from '@/ui/checkbox'
import { Input } from '@/ui/input'
import { NativeSelect } from '@/ui/native-select'
import { Textarea } from '@/ui/textarea'

const TEAM_SIZES = ['1-20', '21-100', '101-500', '501+', 'unsure'] as const
const INTERESTS = ['pilot', 'demo', 'partnership'] as const
type TeamSize = BusinessContactFormPayload['teamSize']
type Interest = BusinessContactFormPayload['interest']

const fieldClass = 'min-h-11 rounded-xl border-outline-secondary bg-white text-textcolor-primary'

export function BusinessLeadForm() {
  const t = useTranslations('pages.Business')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [role, setRole] = useState('')
  const [teamSize, setTeamSize] = useState<TeamSize | ''>('')
  const [interest, setInterest] = useState<Interest>('pilot')
  const [message, setMessage] = useState('')
  const [contactConsent, setContactConsent] = useState(false)
  const [website, setWebsite] = useState('')
  const submissionId = useRef<string | null>(null)
  const submissionPayload = useRef<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle')
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'sending' || status === 'success') return
    setError(null)

    if (
      name.trim().length < 2 ||
      name.length > 120 ||
      companyName.trim().length < 2 ||
      companyName.length > 160 ||
      !z.string().email().safeParse(email.trim()).success ||
      email.length > 254 ||
      role.length > 120 ||
      message.length > 1500 ||
      !TEAM_SIZES.some((size) => size === teamSize) ||
      !INTERESTS.some((option) => option === interest) ||
      !contactConsent
    ) {
      setError(t('invalid'))
      return
    }

    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
    if (!siteKey || !window.grecaptcha) {
      setError(t('captcha'))
      return
    }

    setStatus('sending')
    try {
      const token = await window.grecaptcha.execute(siteKey, { action: 'contact' })
      // Retry the same normalized inquiry with the same UUID; when the user
      // edits a failed submission, it becomes a new qualified inquiry.
      const normalizedPayload = JSON.stringify([
        name.trim(),
        email.trim(),
        companyName.trim(),
        role.trim(),
        teamSize,
        interest,
        message.trim(),
        contactConsent,
        website,
      ])
      if (submissionPayload.current !== normalizedPayload || !submissionId.current) {
        submissionId.current = createLeadSubmissionId()
        submissionPayload.current = normalizedPayload
      }
      const response = await sendBusinessContactForm({
        submissionId: submissionId.current,
        name: name.trim(),
        email: email.trim(),
        companyName: companyName.trim(),
        role: role.trim() || undefined,
        teamSize: teamSize as TeamSize,
        interest,
        message: message.trim() || undefined,
        contactConsent: true,
        token,
        website,
      })
      // Require the typed endpoint's explicit success response. Older backends
      // return 404; never tell a company its lead was recorded when it was not.
      if (!response.ok || (await response.json()).success !== true) {
        throw new Error('Business inquiry not accepted')
      }
      setStatus('success')
    } catch {
      setError(t('failed'))
      setStatus('idle')
    }
  }

  return (
    <section
      id="business-inquiry"
      aria-labelledby="business-inquiry-heading"
      className="rounded-[28px] border border-[#e4d5eb] bg-white/95 p-5 shadow-[0_22px_55px_rgba(102,78,141,0.12)] tablet:p-7"
    >
      {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
        <Script src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`} />
      )}
      <h2 id="business-inquiry-heading" className="text-2xl font-semibold text-[#302a4f]">
        {t('formTitle')}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[#605875]">{t('formSubtitle')}</p>
      {status === 'success' ? (
        <p role="status" className="mt-6 rounded-xl bg-[#eaf7f1] p-4 text-sm text-[#265d4f]">
          {t('success')}
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <label htmlFor="business-name" className="flex flex-col gap-2 text-sm font-medium text-[#403852]">
              {t('fields.name')}
              <Input
                id="business-name"
                autoComplete="name"
                className={fieldClass}
                required
                minLength={2}
                maxLength={120}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label htmlFor="business-email" className="flex flex-col gap-2 text-sm font-medium text-[#403852]">
              {t('fields.email')}
              <Input
                id="business-email"
                type="email"
                autoComplete="email"
                className={fieldClass}
                required
                maxLength={254}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
          </div>
          <label htmlFor="business-company" className="flex flex-col gap-2 text-sm font-medium text-[#403852]">
            {t('fields.companyName')}
            <Input
              id="business-company"
              autoComplete="organization"
              className={fieldClass}
              required
              minLength={2}
              maxLength={160}
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </label>
          <label htmlFor="business-role" className="flex flex-col gap-2 text-sm font-medium text-[#403852]">
            {t('fields.role')}
            <Input
              id="business-role"
              autoComplete="organization-title"
              className={fieldClass}
              maxLength={120}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label htmlFor="business-size" className="flex flex-col gap-2 text-sm font-medium text-[#403852]">
              {t('fields.teamSize')}
              <NativeSelect
                id="business-size"
                className={fieldClass}
                required
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value as TeamSize)}
              >
                <option value="">{t('choose')}</option>
                {TEAM_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {t(`teamSizes.${size}`)}
                  </option>
                ))}
              </NativeSelect>
            </label>
            <label htmlFor="business-interest" className="flex flex-col gap-2 text-sm font-medium text-[#403852]">
              {t('fields.interest')}
              <NativeSelect
                id="business-interest"
                className={fieldClass}
                required
                value={interest}
                onChange={(e) => setInterest(e.target.value as Interest)}
              >
                {INTERESTS.map((option) => (
                  <option key={option} value={option}>
                    {t(`interests.${option}`)}
                  </option>
                ))}
              </NativeSelect>
            </label>
          </div>
          <label htmlFor="business-message" className="flex flex-col gap-2 text-sm font-medium text-[#403852]">
            {t('fields.message')}
            <Textarea
              id="business-message"
              rows={3}
              maxLength={1500}
              className={fieldClass}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </label>
          <Input
            aria-hidden="true"
            tabIndex={-1}
            name="website"
            autoComplete="off"
            className="absolute left-[-9999px]"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
          <label
            htmlFor="business-contact-consent"
            className="flex items-start gap-3 text-sm leading-relaxed text-[#605875]"
          >
            <Checkbox
              id="business-contact-consent"
              required
              className="mt-1 shrink-0"
              checked={contactConsent}
              onCheckedChange={(checked) => setContactConsent(checked === true)}
            />
            {t('fields.consent')}
          </label>
          <Link href={Routes.PRIVACY} className="w-fit text-sm text-[#7654ad] underline underline-offset-4">
            {t('privacyLink')}
          </Link>
          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}
          <Button type="submit" size="large" disabled={status === 'sending'} className="min-h-12">
            {t(status === 'sending' ? 'sending' : 'submit')}
          </Button>
        </form>
      )}
    </section>
  )
}
