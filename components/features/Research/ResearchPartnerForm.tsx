'use client'

import { type FormEvent, useRef, useState } from 'react'
import Script from 'next/script'
import { useTranslations } from 'next-intl'
import { z } from 'zod'

import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/navigation'
import { createLeadSubmissionId } from '@/lib/contact/createLeadSubmissionId'
import { type ResearchContactFormPayload, sendResearchContactForm } from '@/requests/contact'

const RESEARCH_INTERESTS = ['study', 'pilot', 'partnership'] as const
type ResearchInterest = ResearchContactFormPayload['researchInterest']

const inputClass =
  'min-h-11 w-full rounded-xl border border-[#d7c9e0] bg-white px-3 py-2 text-sm text-[#302a4f] outline-none focus-visible:border-[#9372c0] focus-visible:ring-1 focus-visible:ring-[#9372c0]'

/** Only general inquiry details; never request individual participant information. */
export function ResearchPartnerForm() {
  const t = useTranslations('pages.ResearchPartners')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [institutionName, setInstitutionName] = useState('')
  const [researchTopic, setResearchTopic] = useState('')
  const [researchInterest, setResearchInterest] = useState<ResearchInterest>('study')
  const [message, setMessage] = useState('')
  const [contactConsent, setContactConsent] = useState(false)
  const [website, setWebsite] = useState('')
  const submissionId = useRef<string | null>(null)
  const submissionPayload = useRef<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle')
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status !== 'idle') return
    setError(null)

    if (
      name.trim().length < 2 ||
      name.length > 120 ||
      institutionName.trim().length < 2 ||
      institutionName.length > 160 ||
      researchTopic.trim().length < 5 ||
      researchTopic.length > 300 ||
      !z.string().email().safeParse(email.trim()).success ||
      email.length > 254 ||
      message.length > 1000 ||
      !RESEARCH_INTERESTS.some((interest) => interest === researchInterest) ||
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
        institutionName.trim(),
        researchTopic.trim(),
        researchInterest,
        message.trim(),
        contactConsent,
        website,
      ])
      if (submissionPayload.current !== normalizedPayload || !submissionId.current) {
        submissionId.current = createLeadSubmissionId()
        submissionPayload.current = normalizedPayload
      }
      const response = await sendResearchContactForm({
        submissionId: submissionId.current,
        name: name.trim(),
        email: email.trim(),
        institutionName: institutionName.trim(),
        researchTopic: researchTopic.trim(),
        researchInterest,
        message: message.trim() || undefined,
        contactConsent: true,
        website,
        token,
      })
      // Older backend releases return 404 for this new endpoint; never claim
      // an inquiry was accepted unless the research handler confirms it.
      if (!response.ok || (await response.json()).success !== true) {
        throw new Error('Research inquiry not accepted')
      }
      setStatus('success')
    } catch {
      setError(t('failed'))
      setStatus('idle')
    }
  }

  return (
    <section
      id="research-inquiry"
      aria-labelledby="research-inquiry-heading"
      className="rounded-[28px] border border-[#e2d4ed] bg-white/95 p-5 shadow-[0_22px_55px_rgba(102,78,141,0.12)] tablet:p-7"
    >
      {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
        <Script src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`} />
      )}
      <h2 id="research-inquiry-heading" className="text-2xl font-semibold text-[#302a4f]">
        {t('formTitle')}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[#605875]">{t('formSubtitle')}</p>
      {status === 'success' ? (
        <p role="status" className="mt-6 rounded-xl bg-[#eaf7f1] p-4 text-sm text-[#265d4f]">
          {t('success')}
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4" noValidate>
          <label htmlFor="research-name" className="flex flex-col gap-2 text-sm font-medium text-[#403852]">
            {t('fields.name')}
            <input
              id="research-name"
              autoComplete="name"
              className={inputClass}
              required
              minLength={2}
              maxLength={120}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label htmlFor="research-email" className="flex flex-col gap-2 text-sm font-medium text-[#403852]">
            {t('fields.email')}
            <input
              id="research-email"
              type="email"
              autoComplete="email"
              className={inputClass}
              required
              maxLength={254}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label htmlFor="research-institution" className="flex flex-col gap-2 text-sm font-medium text-[#403852]">
            {t('fields.institutionName')}
            <input
              id="research-institution"
              autoComplete="organization"
              className={inputClass}
              required
              minLength={2}
              maxLength={160}
              value={institutionName}
              onChange={(e) => setInstitutionName(e.target.value)}
            />
          </label>
          <label htmlFor="research-topic" className="flex flex-col gap-2 text-sm font-medium text-[#403852]">
            {t('fields.researchTopic')}
            <input
              id="research-topic"
              className={inputClass}
              required
              minLength={5}
              maxLength={300}
              value={researchTopic}
              onChange={(e) => setResearchTopic(e.target.value)}
            />
          </label>
          <label htmlFor="research-interest" className="flex flex-col gap-2 text-sm font-medium text-[#403852]">
            {t('fields.researchInterest')}
            <select
              id="research-interest"
              className={inputClass}
              required
              value={researchInterest}
              onChange={(e) => setResearchInterest(e.target.value as ResearchInterest)}
            >
              {RESEARCH_INTERESTS.map((interest) => (
                <option key={interest} value={interest}>
                  {t(`interests.${interest}`)}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="research-message" className="flex flex-col gap-2 text-sm font-medium text-[#403852]">
            {t('fields.message')}
            <textarea
              id="research-message"
              rows={3}
              maxLength={1000}
              className={inputClass}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </label>
          <input
            name="website"
            aria-hidden="true"
            tabIndex={-1}
            autoComplete="off"
            className="absolute left-[-9999px]"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
          <label htmlFor="research-consent" className="flex items-start gap-3 text-sm leading-relaxed text-[#605875]">
            <input
              id="research-consent"
              type="checkbox"
              required
              checked={contactConsent}
              onChange={(e) => setContactConsent(e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 accent-[#7955bb]"
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
          <button
            type="submit"
            disabled={status === 'sending'}
            className="min-h-12 rounded-full bg-[linear-gradient(110deg,#9959b5,#6755cc)] px-6 py-3 font-semibold text-white disabled:opacity-60"
          >
            {t(status === 'sending' ? 'sending' : 'send')}
          </button>
        </form>
      )}
    </section>
  )
}
