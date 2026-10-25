'use client'
import { type FormEvent, useState } from 'react'
import Script from 'next/script'
import { useLocale, useTranslations } from 'next-intl'
import { z } from 'zod'

import { sendContactForm } from '@/requests/contact'
import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import { Textarea } from '@/ui/textarea'
import { notifyError, notifySuccess } from '@/utils/toast'

declare global {
  interface Window {
    grecaptcha?: {
      execute(siteKey: string, options: { action: string }): Promise<string>
    }
  }
}
export const ContactForm = ({ source, segment }: { source?: 'docs'; segment?: string } = {}) => {
  const t = useTranslations('components.ContactForm')
  const locale = useLocale()
  const topics = {
    uk: { teams: 'Хочу обговорити демонстрацію Dzvin.co для компанії.', individuals: 'Хочу обговорити персональні можливості Dzvin.co.', research: 'Хочу обговорити дослідницьку програму Dzvin.co.' },
    en: { teams: 'I would like a Dzvin.co demonstration for my organization.', individuals: 'I would like to learn about the personal product.', research: 'I would like to discuss a Dzvin.co research program.' },
    pl: { teams: 'Chcę umówić prezentację Dzvin.co dla organizacji.', individuals: 'Chcę poznać ofertę dla osób.', research: 'Chcę omówić program badawczy Dzvin.co.' },
  }
  const lang = locale === 'en' || locale === 'pl' ? locale : 'uk'
  const initialMessage = source === 'docs' ? topics[lang][segment as 'teams' | 'individuals' | 'research'] || topics[lang].teams : ''

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState(initialMessage)
  const [honeypot, setHoneypot] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: '',
  })

  const validateField = (field: 'name' | 'email' | 'message', value: string) => {
    const trimmedValue = value.trim()

    if (!trimmedValue) {
      return 'errorValidateField'
    }

    if (field === 'email') {
      const isValid = z.string().email().safeParse(trimmedValue).success
      if (!isValid) return 'errorValidateFieldEmail'
    }

    return ''
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newErrors = {
      name: validateField('name', name),
      email: validateField('email', email),
      message: validateField('message', message),
    }
    setErrors(newErrors)
    const hasErrors = Object.values(newErrors).some((error) => error !== '')
    if (hasErrors) {
      notifyError(t('errorValidateForm'))
      return
    }

    setLoading(true)

    if (honeypot) {
      setLoading(false)
      notifyError('Unknown error')
      setName('')
      setEmail('')
      setMessage('')
      setHoneypot('')
      return
    }

    try {
      if (!window.grecaptcha) {
        notifyError('reCAPTCHA not loaded')
        setLoading(false)
        return
      }
      const token = await window.grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!, {
        action: 'contact',
      })

      const res = await sendContactForm({
        name,
        email,
        message: source === 'docs' ? `${message}\n\n[Source: docs.dzvin.co | Intent: demo | Segment: ${segment || 'teams'}]` : message,
        token,
      })
      if (!res.ok) throw new Error('Failed to send message')
      setName('')
      setEmail('')
      setMessage('')
      notifySuccess(t('success'))
    } catch (err) {
      if (err instanceof Error) {
        notifyError(err.message)
      } else {
        notifyError('Unknown error')
      }
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="mx-auto max-w-lg py-10">
      <Script src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`} />
      <h1 className="mb-6 text-2xl font-bold">{t('title')}</h1>
      {source === 'docs' && <p className="mb-4 rounded-xl bg-violet-50 p-4 text-sm text-violet-900">{initialMessage}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-sm" noValidate>
        <div className="flex flex-col gap-1">
          <Input
            type="text"
            placeholder={t('name')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => {
              setErrors((prev) => ({
                ...prev,
                name: validateField('name', name),
              }))
            }}
            className={errors.name ? 'border-error' : ''}
            required
          />
          {errors.name && <span className="ml-3 text-sm text-textcolor-muted">{t(errors.name)}</span>}
        </div>
        <div className="flex flex-col gap-1">
          <Input
            type="email"
            placeholder={t('email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => {
              setErrors((prev) => ({
                ...prev,
                email: validateField('email', email),
              }))
            }}
            className={errors.email ? 'border-error' : ''}
            required
          />
          {errors.email && <span className="ml-3 text-sm text-textcolor-muted">{t(errors.email)}</span>}
        </div>
        {/* Honeypot */}
        <input
          name="company"
          className="absolute left-[-9999px]"
          tabIndex={-1}
          autoComplete="off"
          onChange={(e) => setHoneypot(e.target.value)}
        />
        <div className="flex flex-col gap-1">
          <Textarea
            placeholder={t('message')}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onBlur={() => {
              setErrors((prev) => ({
                ...prev,
                message: validateField('message', message),
              }))
            }}
            className={errors.message ? 'border-error' : ''}
            required
          />
          {errors.message && <span className="ml-3 text-sm text-textcolor-muted">{t(errors.message)}</span>}
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? t('sending') : t('send')}
        </Button>
      </form>
    </div>
  )
}
