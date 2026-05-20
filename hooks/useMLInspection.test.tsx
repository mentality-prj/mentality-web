import { act, render, screen, waitFor } from '@testing-library/react'

import { useAdminCompany } from '@/context/adminCompanyContext'
import { useMLInspection } from '@/hooks/useMLInspection'
import { useAuth } from '@/context/AuthProvider'
import { getAdminDiagnosticsInspectionVM } from '@/requests/reportingClient'

jest.mock('next-intl', () => ({ useLocale: () => 'uk' }))

jest.mock('@/context/AuthProvider', () => ({
  useAuth: jest.fn(),
}))

jest.mock('@/context/adminCompanyContext', () => ({
  useAdminCompany: jest.fn(),
}))

jest.mock('@/requests/reportingClient', () => ({
  getAdminDiagnosticsInspectionVM: jest.fn(),
}))

function MLInspectionProbe() {
  const state = useMLInspection()

  return (
    <div>
      <div data-testid="loading">{String(state.loading)}</div>
      <div data-testid="error">{state.error ?? ''}</div>
      <div data-testid="target-id">{state.inspection?.targetId ?? ''}</div>
      <button type="button" onClick={() => void state.refresh()}>
        refresh
      </button>
    </div>
  )
}

describe('useMLInspection', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAuth as jest.Mock).mockReturnValue({
      status: 'authenticated',
      session: {
        user: {
          role: 'admin',
        },
      },
    })
    ;(useAdminCompany as jest.Mock).mockReturnValue({
      companyId: 'company-1',
      isReady: true,
      setCompanyId: jest.fn(),
    })
  })

  it('loads inspection from the selected company diagnostics endpoint', async () => {
    ;(getAdminDiagnosticsInspectionVM as jest.Mock).mockResolvedValue({
      data: {
        targetType: 'company',
        targetId: 'company-1',
        cards: {
          riskScore: {
            id: 'risk',
            title: 'Risk',
            text: '50%',
            supportingText: null,
            tone: 'neutral',
            presentation: 'badge',
            confidence: null,
            recommendedAction: null,
            updatedAt: null,
            visibilityRules: ['diagnostics-only'],
          },
          anomaly: {
            id: 'anomaly',
            title: 'Anomaly',
            text: '20%',
            supportingText: null,
            tone: 'neutral',
            presentation: 'badge',
            confidence: null,
            recommendedAction: null,
            updatedAt: null,
            visibilityRules: ['diagnostics-only'],
          },
          probability: {
            id: 'probability',
            title: 'Probability',
            text: '80%',
            supportingText: null,
            tone: 'neutral',
            presentation: 'badge',
            confidence: null,
            recommendedAction: null,
            updatedAt: null,
            visibilityRules: ['diagnostics-only'],
          },
          modelVersion: {
            id: 'model',
            title: 'Model',
            text: 'ds-ml-v1.0.0:heuristic',
            supportingText: null,
            tone: 'neutral',
            presentation: 'badge',
            confidence: null,
            recommendedAction: null,
            updatedAt: null,
            visibilityRules: ['diagnostics-only'],
          },
        },
        details: [],
        diagnostics: [],
        confidence: null,
        visibilityRules: ['diagnostics-only'],
      },
    })

    render(<MLInspectionProbe />)

    await waitFor(() => {
      expect(getAdminDiagnosticsInspectionVM).toHaveBeenCalledWith({ user: { role: 'admin' } }, 'company-1', 'uk')
    })

    expect(screen.getByTestId('target-id')).toHaveTextContent('company-1')
    expect(screen.getByTestId('error')).toBeEmptyDOMElement()
  })

  it('does not request diagnostics until a company is selected', async () => {
    ;(useAdminCompany as jest.Mock).mockReturnValue({
      companyId: null,
      isReady: false,
      setCompanyId: jest.fn(),
    })

    render(<MLInspectionProbe />)

    await waitFor(() => {
      expect(getAdminDiagnosticsInspectionVM).not.toHaveBeenCalled()
    })

    expect(screen.getByTestId('target-id')).toBeEmptyDOMElement()
  })

  it('keeps the original error when the diagnostics endpoint fails', async () => {
    ;(getAdminDiagnosticsInspectionVM as jest.Mock).mockResolvedValue({
      error: 'Diagnostics endpoint unavailable',
    })

    render(<MLInspectionProbe />)

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Diagnostics endpoint unavailable')
    })
  })

  it('refreshes manually through the same global endpoint', async () => {
    ;(getAdminDiagnosticsInspectionVM as jest.Mock).mockResolvedValue({
      data: {
        targetType: 'company',
        targetId: 'company-1',
        cards: {
          riskScore: {
            id: 'risk',
            title: 'Risk',
            text: '50%',
            supportingText: null,
            tone: 'neutral',
            presentation: 'badge',
            confidence: null,
            recommendedAction: null,
            updatedAt: null,
            visibilityRules: ['diagnostics-only'],
          },
          anomaly: {
            id: 'anomaly',
            title: 'Anomaly',
            text: '20%',
            supportingText: null,
            tone: 'neutral',
            presentation: 'badge',
            confidence: null,
            recommendedAction: null,
            updatedAt: null,
            visibilityRules: ['diagnostics-only'],
          },
          probability: {
            id: 'probability',
            title: 'Probability',
            text: '80%',
            supportingText: null,
            tone: 'neutral',
            presentation: 'badge',
            confidence: null,
            recommendedAction: null,
            updatedAt: null,
            visibilityRules: ['diagnostics-only'],
          },
          modelVersion: {
            id: 'model',
            title: 'Model',
            text: 'ds-ml-v1.0.0:heuristic',
            supportingText: null,
            tone: 'neutral',
            presentation: 'badge',
            confidence: null,
            recommendedAction: null,
            updatedAt: null,
            visibilityRules: ['diagnostics-only'],
          },
        },
        details: [],
        diagnostics: [],
        confidence: null,
        visibilityRules: ['diagnostics-only'],
      },
    })

    render(<MLInspectionProbe />)

    await waitFor(() => {
      expect(getAdminDiagnosticsInspectionVM).toHaveBeenCalledTimes(1)
    })

    await act(async () => {
      screen.getByRole('button', { name: 'refresh' }).click()
    })

    await waitFor(() => {
      expect(getAdminDiagnosticsInspectionVM).toHaveBeenCalledTimes(2)
    })

    expect(getAdminDiagnosticsInspectionVM).toHaveBeenNthCalledWith(2, { user: { role: 'admin' } }, 'company-1', 'uk')
  })
})
