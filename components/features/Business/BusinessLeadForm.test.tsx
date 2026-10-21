import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useTranslations } from 'next-intl'

import { BusinessLeadForm } from '@/components/features/Business/BusinessLeadForm'
import { sendBusinessContactForm } from '@/requests/contact'

jest.mock('next-intl', () => ({ useTranslations: jest.fn() }))
jest.mock('next/script', () => ({ __esModule: true, default: () => null }))
jest.mock('@/requests/contact', () => ({ sendBusinessContactForm: jest.fn() }))
jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}))

const submitBusiness = () => {
  fireEvent.change(screen.getByLabelText('fields.name'), { target: { value: 'Anna Novak' } })
  fireEvent.change(screen.getByLabelText('fields.email'), { target: { value: 'anna@example.com' } })
  fireEvent.change(screen.getByLabelText('fields.companyName'), { target: { value: 'Example Company' } })
  fireEvent.change(screen.getByLabelText('fields.teamSize'), { target: { value: '21-100' } })
  fireEvent.click(screen.getByLabelText('fields.consent'))
  fireEvent.click(screen.getByRole('button', { name: 'submit' }))
}

beforeEach(() => {
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY = 'test-recaptcha-key'
  jest.clearAllMocks()
  ;(useTranslations as jest.Mock).mockReturnValue((key: string) => key)
  ;(window as Window).grecaptcha = { execute: jest.fn().mockResolvedValue('verified-token') }
})

describe('B2B pilot form', () => {
  it('rejects empty or incomplete business contacts without sending a request', () => {
    render(<BusinessLeadForm />)
    fireEvent.click(screen.getByRole('button', { name: 'submit' }))
    expect(screen.getByRole('alert')).toHaveTextContent('invalid')
    expect(sendBusinessContactForm).not.toHaveBeenCalled()
  })

  it('posts typed lead data without the legacy company honeypot collision', async () => {
    ;(sendBusinessContactForm as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    })
    render(<BusinessLeadForm />)
    submitBusiness()
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('success'))
    expect(sendBusinessContactForm).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Anna Novak',
        email: 'anna@example.com',
        companyName: 'Example Company',
        teamSize: '21-100',
        interest: 'pilot',
        contactConsent: true,
        token: 'verified-token',
      })
    )
    const submitted = (sendBusinessContactForm as jest.Mock).mock.calls[0][0] as Record<string, unknown>
    expect(submitted.company).toBeUndefined()
    expect(submitted.message).toBeUndefined()
  })

  it('does not report success when the new backend endpoint is unavailable', async () => {
    ;(sendBusinessContactForm as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
    })
    render(<BusinessLeadForm />)
    submitBusiness()
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('failed'))
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.getByLabelText('fields.companyName')).toHaveValue('Example Company')
  })

  it('does not submit without captcha even when all business details are present', async () => {
    ;(window as Window).grecaptcha = undefined
    render(<BusinessLeadForm />)
    submitBusiness()
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('captcha'))
    expect(sendBusinessContactForm).not.toHaveBeenCalled()
  })
})
