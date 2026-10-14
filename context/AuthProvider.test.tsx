import { act, render, screen } from '@testing-library/react'

import { AuthProvider, useAuth } from '@/context/AuthProvider'
import { authService } from '@/lib/auth'

jest.mock('@/lib/auth', () => ({
  authService: {
    name: 'zitadel',
    getStoredTokens: jest.fn(),
    getUser: jest.fn(),
    refreshTokens: jest.fn(),
    clearTokens: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
  },
}))
jest.mock('@/lib/logger', () => ({
  logger: { error: jest.fn(), warn: jest.fn(), info: jest.fn() },
}))

const user = { id: 'user-1', name: 'Company Manager', email: 'manager@example.test', role: 'user' }
const membership = { ...user, companyId: 'company-1', companyRole: 'manager' }
const now = Math.floor(Date.now() / 1000)

function AuthState() {
  const { session, status } = useAuth()
  return (
    <div>
      <span data-testid="status">{status}</span>
      <span data-testid="company">{session?.user?.companyId ?? 'none'}</span>
      <span data-testid="role">{session?.user?.companyRole ?? 'none'}</span>
    </div>
  )
}

async function mountWithToken(expiresAt: number) {
  ;(authService.getStoredTokens as jest.Mock).mockResolvedValue({
    expiresAt,
    hasRefreshToken: true,
  })
  ;(authService.getUser as jest.Mock).mockResolvedValueOnce(membership)
  await act(async () => {
    render(
      <AuthProvider>
        <AuthState />
      </AuthProvider>
    )
  })
  expect(screen.getByTestId('status')).toHaveTextContent('authenticated')
  expect(screen.getByTestId('company')).toHaveTextContent('company-1')
}

describe('AuthProvider role revalidation after token refresh', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
    ;(authService.clearTokens as jest.Mock).mockResolvedValue(undefined)
  })

  afterEach(() => jest.useRealTimers())

  it('replaces a revoked company membership with backend-verified user data', async () => {
    await mountWithToken(now + 61)
    ;(authService.refreshTokens as jest.Mock).mockResolvedValue({
      expiresAt: now + 3600,
      hasRefreshToken: true,
    })
    ;(authService.getUser as jest.Mock).mockResolvedValueOnce(user)

    await act(async () => {
      jest.advanceTimersByTime(2000)
      await Promise.resolve()
    })

    expect(authService.refreshTokens).toHaveBeenCalledTimes(1)
    expect(authService.getUser).toHaveBeenCalledTimes(2)
    expect(screen.getByTestId('company')).toHaveTextContent('none')
    expect(screen.getByTestId('role')).toHaveTextContent('none')
    expect(screen.getByTestId('status')).toHaveTextContent('authenticated')
  })

  it('clears local authorization when the server rejects the refreshed session', async () => {
    await mountWithToken(now + 61)
    ;(authService.refreshTokens as jest.Mock).mockResolvedValue({
      expiresAt: now + 3600,
      hasRefreshToken: true,
    })
    ;(authService.getUser as jest.Mock).mockResolvedValueOnce(null)

    await act(async () => {
      jest.advanceTimersByTime(2000)
      await Promise.resolve()
    })

    expect(screen.getByTestId('status')).toHaveTextContent('unauthenticated')
    expect(screen.getByTestId('company')).toHaveTextContent('none')
    expect(authService.clearTokens).toHaveBeenCalledTimes(1)
  })

  it('refreshes a near-expiry token without skipping its immediate timer', async () => {
    await mountWithToken(now + 15)
    ;(authService.refreshTokens as jest.Mock).mockResolvedValue({
      expiresAt: now + 3600,
      hasRefreshToken: true,
    })
    ;(authService.getUser as jest.Mock).mockResolvedValueOnce(membership)

    await act(async () => {
      jest.advanceTimersByTime(0)
      await Promise.resolve()
    })

    expect(authService.refreshTokens).toHaveBeenCalledTimes(1)
    expect(authService.getUser).toHaveBeenCalledTimes(2)
    expect(screen.getByTestId('status')).toHaveTextContent('authenticated')
  })

  it('fails closed when the token refresh rejects instead of leaving stale privileges', async () => {
    await mountWithToken(now + 61)
    ;(authService.refreshTokens as jest.Mock).mockRejectedValue(new Error('network unavailable'))

    await act(async () => {
      jest.advanceTimersByTime(2000)
      await Promise.resolve()
    })

    expect(screen.getByTestId('status')).toHaveTextContent('unauthenticated')
    expect(screen.getByTestId('company')).toHaveTextContent('none')
    expect(authService.clearTokens).toHaveBeenCalledTimes(1)
  })
})
