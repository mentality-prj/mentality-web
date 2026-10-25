import { fireEvent, render, screen } from '@testing-library/react'

import { ContactForm } from './ContactForm'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'uk',
}))
jest.mock(
  'next/script',
  () =>
    function MockScript() {
      return null
    }
)
jest.mock('@/requests/contact', () => ({ sendContactForm: jest.fn() }))
jest.mock('@/utils/toast', () => ({
  notifyError: jest.fn(),
  notifySuccess: jest.fn(),
}))

describe('ContactForm mobile readiness', () => {
  it('disables sending while required fields are missing or invalid', () => {
    render(<ContactForm />)
    const send = screen.getByRole('button', { name: 'send' })
    expect(send).toBeDisabled()

    fireEvent.change(screen.getByPlaceholderText('name'), {
      target: { value: 'A' },
    })
    fireEvent.change(screen.getByPlaceholderText('email'), {
      target: { value: 'invalid' },
    })
    fireEvent.change(screen.getByPlaceholderText('message'), {
      target: { value: 'Hey' },
    })
    expect(send).toBeDisabled()

    fireEvent.change(screen.getByPlaceholderText('name'), {
      target: { value: 'Valid Name' },
    })
    fireEvent.change(screen.getByPlaceholderText('email'), {
      target: { value: 'valid@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('message'), {
      target: { value: 'Please get in touch' },
    })
    expect(send).toBeEnabled()
  })

  it('keeps the prefilled investment message visible and editable', () => {
    render(<ContactForm source="docs" segment="investment" intent="funding" />)
    const field = screen.getByPlaceholderText('message') as HTMLTextAreaElement
    expect(field.value).toContain('QDIP/Decision Intelligence')
    expect(field.rows).toBe(5)
    expect(field.className).toContain('resize-y')
    expect(screen.getByRole('button', { name: 'send' })).toBeDisabled()
  })
})
