import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import {
  advanceOperatorLeadStage,
  completeOperatorLeadFollowUp,
  getOperatorLead,
  getOperatorLeadSummary,
  listOperatorLeads,
  planOperatorLeadFollowUp,
} from '@/helpers/api-wrapper'

import { LeadOperatorConsole } from './LeadOperatorConsole'

jest.mock('next-intl', () => {
  const translate = (key: string, variables?: { stage?: string }) =>
    variables?.stage ? `${key}: ${variables.stage}` : key
  return { useTranslations: () => translate }
})

jest.mock('@/helpers/api-wrapper', () => ({
  listOperatorLeads: jest.fn(),
  getOperatorLead: jest.fn(),
  getOperatorLeadSummary: jest.fn(),
  advanceOperatorLeadStage: jest.fn(),
  completeOperatorLeadFollowUp: jest.fn(),
  planOperatorLeadFollowUp: jest.fn(),
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
  followUpRevision: 0,
}

beforeEach(() => {
  jest.clearAllMocks()
  ;(listOperatorLeads as jest.Mock).mockResolvedValue({ ok: true, json: async () => [lead] })
  ;(getOperatorLead as jest.Mock).mockResolvedValue({ ok: true, json: async () => detail })
  ;(getOperatorLeadSummary as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => ({
      category: 'business',
      total: 9,
      due: 2,
      asOfDate: '2026-10-22',
      stages: {
        inquiry: 3,
        qualified: 2,
        demo: 1,
        pilot: 1,
        decision: 1,
        won: 1,
        lost: 0,
        closed: 0,
      },
    }),
  })
})

describe('private lead operator console', () => {
  it('shows no contact email before explicitly requesting a lead detail', async () => {
    render(<LeadOperatorConsole />)
    await waitFor(() => expect(screen.getByText('Example Company')).toBeInTheDocument())
    expect(screen.queryByText('anna@company.example')).not.toBeInTheDocument()
    expect(listOperatorLeads).toHaveBeenCalledWith('business', false)

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

  it.each([
    [409, 'conflict'],
    [503, 'unavailable'],
  ])('distinguishes stage PATCH HTTP %s from a genuine concurrency conflict', async (status, message) => {
    ;(advanceOperatorLeadStage as jest.Mock).mockResolvedValue({ ok: false, status })
    render(<LeadOperatorConsole />)
    fireEvent.click(await screen.findByRole('button', { name: /Example Company/ }))
    fireEvent.click(await screen.findByRole('button', { name: 'moveTo: stages.qualified' }))

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(message))
    expect(advanceOperatorLeadStage).toHaveBeenCalledTimes(1)
    // A rejected write must not trigger a detail/queue refresh claiming success.
    expect(getOperatorLead).toHaveBeenCalledTimes(1)
  })

  it('does not call a committed stage transition a conflict when its refresh fails', async () => {
    ;(advanceOperatorLeadStage as jest.Mock).mockResolvedValue({ ok: true })
    ;(getOperatorLead as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => detail })
      .mockResolvedValueOnce({ ok: false, status: 503 })
    render(<LeadOperatorConsole />)
    fireEvent.click(await screen.findByRole('button', { name: /Example Company/ }))
    fireEvent.click(await screen.findByRole('button', { name: 'moveTo: stages.qualified' }))

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('unavailable'))
    expect(screen.queryByText('conflict')).not.toBeInTheDocument()
    expect(screen.queryByText('anna@company.example')).not.toBeInTheDocument()
    expect(advanceOperatorLeadStage).toHaveBeenCalledTimes(1)
  })

  it('does not invite a duplicate follow-up after a successful PATCH and failed queue refresh', async () => {
    ;(planOperatorLeadFollowUp as jest.Mock).mockResolvedValue({ ok: true })
    ;(listOperatorLeads as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => [lead] })
      .mockResolvedValueOnce({ ok: false, status: 503 })
    render(<LeadOperatorConsole />)
    fireEvent.click(await screen.findByRole('button', { name: /Example Company/ }))
    fireEvent.change(await screen.findByLabelText('followUpOn'), { target: { value: '2026-11-02' } })
    fireEvent.click(screen.getByRole('button', { name: 'saveFollowUp' }))

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('unavailable'))
    expect(screen.queryByRole('button', { name: 'saveFollowUp' })).not.toBeInTheDocument()
    expect(planOperatorLeadFollowUp).toHaveBeenCalledTimes(1)
  })

  it('hides all lead details when the operator-only backend denies access', async () => {
    ;(listOperatorLeads as jest.Mock).mockResolvedValue({ ok: false, status: 403 })
    render(<LeadOperatorConsole />)
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('unavailable'))
    // A denied operator request is not proof that the pipeline is empty.
    expect(screen.queryByText('empty')).not.toBeInTheDocument()
    expect(screen.queryByText('anna@company.example')).not.toBeInTheDocument()
    expect(getOperatorLead).not.toHaveBeenCalled()
  })
  it('updates follow-up due date using the selected stage and revision', async () => {
    ;(planOperatorLeadFollowUp as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ followUpOn: '2026-11-02', nextAction: 'schedule_demo', followUpRevision: 1 }),
    })
    render(<LeadOperatorConsole />)
    await waitFor(() => expect(screen.getByRole('button', { name: /Example Company/ })).toBeInTheDocument())
    fireEvent.click(screen.getByRole('button', { name: /Example Company/ }))
    const date = await screen.findByLabelText('followUpOn')
    fireEvent.change(date, { target: { value: '2026-11-02' } })
    fireEvent.change(screen.getByLabelText('nextAction'), { target: { value: 'schedule_demo' } })
    fireEvent.click(screen.getByRole('button', { name: 'saveFollowUp' }))
    await waitFor(() =>
      expect(planOperatorLeadFollowUp).toHaveBeenCalledWith(lead._id, 'inquiry', 0, '2026-11-02', 'schedule_demo')
    )
  })

  it('switches to a due-only queue without retrieving personal details', async () => {
    render(<LeadOperatorConsole />)
    await waitFor(() => expect(screen.getByRole('button', { name: /Example Company/ })).toBeInTheDocument())
    fireEvent.click(screen.getByLabelText('dueOnly'))
    await waitFor(() => expect(listOperatorLeads).toHaveBeenCalledWith('business', true))
    expect(getOperatorLead).not.toHaveBeenCalled()
  })
  it('records a human contact result and removes the completed reminder', async () => {
    ;(getOperatorLead as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ ...detail, followUpOn: '2026-10-15', nextAction: 'reply' }),
    })
    ;(completeOperatorLeadFollowUp as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({}) })
    render(<LeadOperatorConsole />)
    await waitFor(() => expect(screen.getByRole('button', { name: /Example Company/ })).toBeInTheDocument())
    fireEvent.click(screen.getByRole('button', { name: /Example Company/ }))
    fireEvent.click(await screen.findByRole('button', { name: 'contacted' }))
    await waitFor(() =>
      expect(completeOperatorLeadFollowUp).toHaveBeenCalledWith(lead._id, 'inquiry', 0, 'contacted', null, null)
    )
  })

  it('requires a future reschedule when the partner did not respond', async () => {
    ;(getOperatorLead as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ ...detail, followUpOn: '2026-10-15', nextAction: 'reply' }),
    })
    ;(completeOperatorLeadFollowUp as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({}) })
    render(<LeadOperatorConsole />)
    await waitFor(() => expect(screen.getByRole('button', { name: /Example Company/ })).toBeInTheDocument())
    fireEvent.click(screen.getByRole('button', { name: /Example Company/ }))
    const button = await screen.findByRole('button', { name: 'noResponseReschedule' })
    expect(button).toBeDisabled()
    const nextDay = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10)
    fireEvent.change(screen.getByLabelText('followUpOn'), { target: { value: nextDay } })
    expect(button).toBeEnabled()
    fireEvent.click(button)
    await waitFor(() =>
      expect(completeOperatorLeadFollowUp).toHaveBeenCalledWith(lead._id, 'inquiry', 0, 'no_response', nextDay, 'reply')
    )
  })
  it('shows first-party aggregated counts without contact identities or website conversions', async () => {
    render(<LeadOperatorConsole />)
    await waitFor(() => expect(screen.getByLabelText('pipelineOverview')).toBeInTheDocument())
    expect(getOperatorLeadSummary).toHaveBeenCalledWith('business')
    expect(screen.getByText('totalLeads')).toBeInTheDocument()
    expect(screen.getByText('dueLeads')).toBeInTheDocument()
    expect(screen.queryByText('anna@company.example')).not.toBeInTheDocument()
  })

  it('never displays a stale business count when the operator switches to research', async () => {
    render(<LeadOperatorConsole />)
    await waitFor(() => expect(screen.getByLabelText('pipelineOverview')).toBeInTheDocument())
    fireEvent.change(screen.getByLabelText('category'), { target: { value: 'research' } })
    await waitFor(() => expect(getOperatorLeadSummary).toHaveBeenCalledWith('research'))
    expect(screen.queryByLabelText('pipelineOverview')).not.toBeInTheDocument()
  })
})
