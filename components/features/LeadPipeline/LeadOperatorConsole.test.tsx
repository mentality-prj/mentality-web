import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { LeadOperatorConsole } from './LeadOperatorConsole'

jest.mock('next-intl', () => {
  const translate = (key: string, variables?: { stage?: string }) =>
    variables?.stage ? `${key}: ${variables.stage}` : key
  return { useTranslations: () => translate }
})

const lead = {
  _id: '507f1f77bcf86cd799439011',
  category: 'business',
  companyName: 'Example Company',
  leadStage: 'inquiry',
}
const detail = {
  ...lead,
  name: 'Anna Novak',
  email: 'anna@company.example',
  message: 'Interested in a pilot',
}

const originalFetch = global.fetch

afterEach(() => {
  global.fetch = originalFetch
  jest.clearAllMocks()
})

describe('private lead operator console', () => {
  it('does not receive contact email in list and loads it only after a selection', async () => {
    global.fetch = jest.fn().mockImplementation(async (url: string) => {
      const body = url.endsWith('/' + lead._id) ? detail : [lead]
      return { ok: true, json: async () => body }
    }) as unknown as typeof fetch

    render(<LeadOperatorConsole />)
    await waitFor(() => expect(screen.getByText('Example Company')).toBeInTheDocument())
    expect(screen.queryByText('anna@company.example')).not.toBeInTheDocument()
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/backend/contact/internal/leads?category=business&limit=25',
      expect.objectContaining({ cache: 'no-store' })
    )
    fireEvent.click(screen.getByRole('button', { name: /Example Company/ }))
    await waitFor(() => expect(screen.getByText('anna@company.example')).toBeInTheDocument())
  })

  it('sends compare-and-swap expectedStage with the selected lead identity', async () => {
    const requests: Array<{ url: string; init?: RequestInit }> = []
    global.fetch = jest.fn().mockImplementation(async (url: string, init?: RequestInit) => {
      requests.push({ url, init })
      if (init?.method === 'PATCH') return { ok: true, json: async () => ({ leadStage: 'qualified' }) }
      if (url.endsWith('/' + lead._id)) return { ok: true, json: async () => detail }
      return { ok: true, json: async () => [lead] }
    }) as unknown as typeof fetch

    render(<LeadOperatorConsole />)
    await waitFor(() => expect(screen.getByRole('button', { name: /Example Company/ })).toBeInTheDocument())
    fireEvent.click(screen.getByRole('button', { name: /Example Company/ }))
    await waitFor(() => expect(screen.getByRole('button', { name: 'moveTo: stages.qualified' })).toBeInTheDocument())
    fireEvent.click(screen.getByRole('button', { name: 'moveTo: stages.qualified' }))

    await waitFor(() => expect(requests.some((request) => request.init?.method === 'PATCH')).toBe(true))
    const request = requests.find((entry) => entry.init?.method === 'PATCH')
    expect(request?.url).toBe('/api/backend/contact/internal/leads/' + lead._id + '/stage')
    expect(JSON.parse(String(request?.init?.body))).toEqual({
      expectedStage: 'inquiry',
      nextStage: 'qualified',
    })
  })

  it('fails without displaying lead data when backend denies access', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 403 }) as unknown as typeof fetch
    render(<LeadOperatorConsole />)
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('unavailable'))
    expect(screen.queryByText('anna@company.example')).not.toBeInTheDocument()
  })
})
