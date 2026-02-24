'use client'
import { SubmitEventHandler, useState } from 'react'
import { useTranslations } from 'next-intl'

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
const ContactPage = () => {
  const t = useTranslations('components.ContactForm')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
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
        message,
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
      <h1 className="mb-6 text-2xl font-bold">{t('title')}</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-sm">
        <Input type="text" placeholder={t('name')} value={name} onChange={(e) => setName(e.target.value)} required />
        <Input
          type="email"
          placeholder={t('email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {/* Honeypot */}
        <input name="company" style={{ display: 'none' }} onChange={(e) => setHoneypot(e.target.value)} />
        <Textarea placeholder={t('message')} value={message} onChange={(e) => setMessage(e.target.value)} required />
        <Button type="submit" disabled={loading}>
          {loading ? t('sending') : t('send')}
        </Button>
      </form>
      {/* reCAPTCHA script should be loaded globally in _document or _app */}
    </div>
  )
}

export default ContactPage
