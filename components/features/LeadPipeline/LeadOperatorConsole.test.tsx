import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { advanceOperatorLeadStage, getOperatorLead, listOperatorLeads } from '@/helpers/api-wrapper'

import { LeadOperatorConsole } from './LeadOperatorConsole'

jest.mock('next-intl', () => {
  const translate = (key: string, variables?: { stage?: string }) =>
    variables?.stage ? `${key}: ${variables.stage}` : key
  return { useTranslations: () => translate }
})

jest.mock('@/helpers/api-wrapper', () => ({
  listOperatorLeads: jest.fn(),
  getOperatorLead: jest.fn(),
  advanceOperatorLeadStage: jest.fn(),
}))

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

beforeEach(() => {
  jest.clearAllMocks()
  ;(listOperatorLeads as jest.Mock).mockResolvedValue({ ok: true, json: async () => [lead] })
  ;(getOperatorLead as jest.Mock).mockResolvedValue({ ok: true, json: async () => detail })
})

describe('private lead operator console', () => {
  it('shows no contact email before explicitly requesting a lead detail', async () => {
    render(<LeadOperatorConsole />)
    await waitFor(() => expect(screen.getByText('Example Company')).toBeInTheDocument())
    expect(screen.queryByText('anna@company.example')).not.toBeInTheDocument()
    expect(listOperatorLeads).toHaveBeenCalledWith('business')

    fireEvent.click(screen.getByRole('button', { name: /Example Company/ }))
    await waitFor(() => expect(screen.getByText('anna@company.example')).toBeInTheDocument())
    expect(getOperatorLead).toHaveBeenCalledWith(lead._id)
  })

  it('submits compare-and-swap stage transition using the selected lead ID', async () => {
    ;(advanceOperatorLeadStage as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ leadStage: 'qualified' }),
    })
    render(<LeadOperatorConsole />)
    await waitFor(() => expect(screen.getByRole('button', { name: /Example Company/ })).toBeInTheDocument())
    fireEvent.click(screen.getByRole('button', { name: /Example Company/ }))
    await waitFor(() => expect(screen.getByRole('button', { name: 'moveTo: stages.qualified' })).toBeInTheDocument())

    fireEvent.click(screen.getByRole('button', { name: 'moveTo: stages.qualified' }))
    await waitFor(() => {
      expect(advanceOperatorLeadStage).toHaveBeenCalledWith(lead._id, 'inquiry', 'qualified')
    })
  })

  it('hides all lead details when the operator-only backend denies access', async () => {
    ;(listOperatorLeads as jest.Mock).mockResolvedValue({ ok: false, status: 403 })
    render(<LeadOperatorConsole />)
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('unavailable'))
    expect(screen.queryByText('anna@company.example')).not.toBeInTheDocument()
    expect(getOperatorLead).not.toHaveBeenCalled()
  })
})
