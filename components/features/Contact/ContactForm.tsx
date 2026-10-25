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
export const ContactForm = ({
  source,
  segment,
  intent,
}: { source?: 'docs'; segment?: string; intent?: 'funding' | 'demo' } = {}) => {
  const t = useTranslations('components.ContactForm')
  const locale = useLocale()
  const topics = {
    uk: {
      teams: 'Хочу обговорити демонстрацію Dzvin.co для компанії.',
      individuals: 'Хочу обговорити персональні можливості Dzvin.co.',
      research: 'Хочу обговорити дослідницьку програму Dzvin.co.',
    },
    en: {
      teams: 'I would like a Dzvin.co demonstration for my organization.',
      individuals: 'I would like to learn about the personal product.',
      research: 'I would like to discuss a Dzvin.co research program.',
    },
    pl: {
      teams: 'Chcę umówić prezentację Dzvin.co dla organizacji.',
      individuals: 'Chcę poznać ofertę dla osób.',
      research: 'Chcę omówić program badawczy Dzvin.co.',
    },
  }

  const fundingTopics = {
    uk: {
      investment:
        'Хочу обговорити інвестування у запуск Dzvin.co: стадія розробки, QDIP/Decision Intelligence, бюджет і milestones.',
      grant:
        'Хочу обговорити грантове фінансування дослідження Decision Intelligence in mental health на базі Dzvin.co.',
    },
    en: {
      investment:
        'I would like to discuss financing the development and launch of Dzvin.co, including milestones and the QDIP research track.',
      grant: 'I would like to discuss research/grant funding for Decision Intelligence in mental health with Dzvin.co.',
    },
    pl: {
      investment: 'Chcę omówić finansowanie rozwoju i uruchomienia Dzvin.co, etapy i kierunek badań QDIP.',
      grant: 'Chcę omówić dofinansowanie badań Decision Intelligence in mental health w Dzvin.co.',
    },
  }
  const lang = locale === 'en' || locale === 'pl' ? locale : 'uk'
  const initialMessage =
    source === 'docs'
      ? intent === 'funding'
        ? fundingTopics[lang][segment === 'grant' ? 'grant' : 'investment']
        : topics[lang][segment as 'teams' | 'individuals' | 'research'] || topics[lang].teams
      : ''

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

    if (field === 'name' && trimmedValue.length < 2) return 'errorValidateFieldName'
    if (field === 'message' && trimmedValue.length < 5) return 'errorValidateFieldMessage'

    if (field === 'email') {
      const isValid = z.string().email().safeParse(trimmedValue).success
      if (!isValid) return 'errorValidateFieldEmail'
    }

    return ''
  }

  const canSubmit =
    !validateField('name', name) && !validateField('email', email) && !validateField('message', message) && !honeypot

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
        notifyError(t('errorCaptcha'))
        setLoading(false)
        return
      }
      const token = await window.grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!, {
        action: 'contact',
      })

      const res = await sendContactForm({
        name,
        email,
        message:
          source === 'docs'
            ? `${message}\n\n[Source: docs.dzvin.co | Intent: ${intent === 'funding' ? 'funding' : 'demo'} | Segment: ${segment || (intent === 'funding' ? 'investment' : 'teams')}]`
            : message,
        token,
      })
      if (!res.ok) {
        notifyError(t(res.status === 403 ? 'errorCaptcha' : 'errorUnavailable'))
        return
      }
      const receipt = (await res.json()) as { success?: boolean }
      if (receipt.success !== true) {
        notifyError(t('errorUnavailable'))
        return
      }
      setName('')
      setEmail('')
      setMessage('')
      notifySuccess(t('success'))
    } catch {
      notifyError(t('errorUnavailable'))
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="mx-auto max-w-lg py-10">
      <Script src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`} />
      <h1 className="mb-6 text-2xl font-bold">{t('title')}</h1>
      {source === 'docs' && (
        <p className="mb-4 rounded-md bg-violet-50 p-4 text-sm text-violet-900">{initialMessage}</p>
      )}
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
            rows={5}
            className={`min-h-40 resize-y ${errors.message ? 'border-error' : ''}`}
            required
          />
          {errors.message && <span className="ml-3 text-sm text-textcolor-muted">{t(errors.message)}</span>}
        </div>
        <Button type="submit" disabled={loading || !canSubmit}>
          {loading ? t('sending') : t('send')}
        </Button>
      </form>
    </div>
  )
}
