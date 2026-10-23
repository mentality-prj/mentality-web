import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useTranslations } from 'next-intl'

import { ResearchPartnerForm } from '@/components/features/Research/ResearchPartnerForm'
import { sendResearchContactForm } from '@/requests/contact'

jest.mock('next-intl', () => ({ useTranslations: jest.fn() }))
jest.mock('next/script', () => ({ __esModule: true, default: () => null }))
jest.mock('@/requests/contact', () => ({ sendResearchContactForm: jest.fn() }))
jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}))

function completeInquiry() {
  fireEvent.change(screen.getByLabelText('fields.name'), { target: { value: 'Researcher Novak' } })
  fireEvent.change(screen.getByLabelText('fields.email'), { target: { value: 'novak@university.example' } })
  fireEvent.change(screen.getByLabelText('fields.institutionName'), {
    target: { value: 'Institute of Social Studies' },
  })
  fireEvent.change(screen.getByLabelText('fields.researchTopic'), {
    target: { value: 'Daily self-support and wellbeing' },
  })
  fireEvent.click(screen.getByLabelText('fields.consent'))
  fireEvent.click(screen.getByRole('button', { name: 'send' }))
}

beforeEach(() => {
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY = 'test-site-key'
  jest.clearAllMocks()
  ;(useTranslations as jest.Mock).mockReturnValue((key: string) => key)
  window.grecaptcha = { execute: jest.fn().mockResolvedValue('captcha-token') }
})

describe('research partner inquiry form', () => {
  it('never sends an incomplete or non-consented form', () => {
    render(<ResearchPartnerForm />)
    fireEvent.click(screen.getByRole('button', { name: 'send' }))
    expect(screen.getByRole('alert')).toHaveTextContent('invalid')
    expect(sendResearchContactForm).not.toHaveBeenCalled()
  })

  it('submits only typed institutional discovery details', async () => {
    ;(sendResearchContactForm as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    })
    render(<ResearchPartnerForm />)
    completeInquiry()
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('success'))
    expect(sendResearchContactForm).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Researcher Novak',
        institutionName: 'Institute of Social Studies',
        researchTopic: 'Daily self-support and wellbeing',
        researchInterest: 'study',
        contactConsent: true,
        token: 'captcha-token',
      })
    )
    const submitted = (sendResearchContactForm as jest.Mock).mock.calls[0][0] as Record<string, unknown>
    expect(submitted.userId).toBeUndefined()
    expect(submitted.company).toBeUndefined()
    expect(submitted.diary).toBeUndefined()
  })

  it('reuses the same submission key when network success is uncertain', async () => {
    ;(sendResearchContactForm as jest.Mock)
      .mockRejectedValueOnce(new Error('timeout after save'))
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) })

    render(<ResearchPartnerForm />)
    completeInquiry()
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('failed'))
    const first = (sendResearchContactForm as jest.Mock).mock.calls[0][0].submissionId as string

    fireEvent.click(screen.getByRole('button', { name: 'send' }))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('success'))
    const second = (sendResearchContactForm as jest.Mock).mock.calls[1][0].submissionId as string

    expect(first).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    expect(second).toBe(first)
  })

  it('rotates submission ID when edited form data would otherwise collide with an old lead', async () => {
    ;(sendResearchContactForm as jest.Mock)
      .mockRejectedValueOnce(new Error('timeout'))
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) })

    render(<ResearchPartnerForm />)
    completeInquiry()
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('failed'))
    const original = (sendResearchContactForm as jest.Mock).mock.calls[0][0].submissionId as string

    fireEvent.change(screen.getByLabelText('fields.institutionName'), { target: { value: 'Updated University Lab' } })
    fireEvent.click(screen.getByRole('button', { name: 'send' }))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('success'))
    const updated = (sendResearchContactForm as jest.Mock).mock.calls[1][0].submissionId as string
    expect(updated).not.toBe(original)
  })

  it('does not announce success for an unavailable new backend route', async () => {
    ;(sendResearchContactForm as jest.Mock).mockResolvedValue({ ok: false, status: 404 })
    render(<ResearchPartnerForm />)
    completeInquiry()
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('failed'))
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.getByLabelText('fields.institutionName')).toHaveValue('Institute of Social Studies')
  })

  it('requires captcha readiness before sending', async () => {
    window.grecaptcha = undefined
    render(<ResearchPartnerForm />)
    completeInquiry()
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('captcha'))
    expect(sendResearchContactForm).not.toHaveBeenCalled()
  })
})
