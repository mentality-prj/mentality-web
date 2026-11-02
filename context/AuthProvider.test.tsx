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
    clearTokensIfUnchanged: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
  },
}))
jest.mock('@/lib/logger', () => ({
  logger: { error: jest.fn(), warn: jest.fn(), info: jest.fn() },
}))

const user = { id: 'user-1', name: 'Company Manager', email: 'manager@example.test', role: 'user' }
const membership = { ...user, companyId: 'company-1', companyRole: 'manager' }
const now = Math.floor(new Date('2026-10-18T12:00:00.000Z').getTime() / 1000)

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
    jest.useFakeTimers().setSystemTime(new Date(now * 1000))
    jest.resetAllMocks()
    ;(authService.clearTokens as jest.Mock).mockResolvedValue(undefined)
    ;(authService.clearTokensIfUnchanged as jest.Mock).mockResolvedValue(true)
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
    expect(authService.clearTokensIfUnchanged).toHaveBeenCalledTimes(1)
  })

  it('refreshes a token 30 seconds from expiry during initial hydration', async () => {
    ;(authService.refreshTokens as jest.Mock).mockResolvedValue({
      expiresAt: now + 3600,
      hasRefreshToken: true,
    })
    await mountWithToken(now + 30)

    expect(authService.refreshTokens).toHaveBeenCalledTimes(1)
    expect(authService.getUser).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('status')).toHaveTextContent('authenticated')
  })

  it('recovers an expired cookie during initialization when rotation succeeds', async () => {
    ;(authService.refreshTokens as jest.Mock).mockResolvedValue({
      expiresAt: now + 3600,
      hasRefreshToken: true,
    })
    await mountWithToken(now - 5)

    expect(authService.refreshTokens).toHaveBeenCalledTimes(1)
    expect(authService.clearTokensIfUnchanged).not.toHaveBeenCalled()
  })

  it('keeps expired refresh credentials during a temporary Zitadel outage', async () => {
    ;(authService.getStoredTokens as jest.Mock).mockResolvedValue({
      expiresAt: now - 5,
      hasRefreshToken: true,
    })
    ;(authService.refreshTokens as jest.Mock).mockRejectedValue(new Error('Zitadel offline'))

    await act(async () => {
      render(
        <AuthProvider>
          <AuthState />
        </AuthProvider>
      )
    })

    expect(screen.getByTestId('status')).toHaveTextContent('loading')
    expect(authService.clearTokensIfUnchanged).not.toHaveBeenCalled()
  })

  it('clears an expired cookie when refresh fails on initial hydration', async () => {
    ;(authService.getStoredTokens as jest.Mock).mockResolvedValue({
      expiresAt: now - 5,
      hasRefreshToken: true,
    })
    ;(authService.refreshTokens as jest.Mock).mockResolvedValue(null)

    await act(async () => {
      render(
        <AuthProvider>
          <AuthState />
        </AuthProvider>
      )
    })

    expect(screen.getByTestId('status')).toHaveTextContent('unauthenticated')
    expect(authService.clearTokensIfUnchanged).toHaveBeenCalledTimes(1)
  })

  it('keeps a still-valid backend session during transient refresh outage and retries later', async () => {
    await mountWithToken(now + 61)
    ;(authService.refreshTokens as jest.Mock)
      .mockRejectedValueOnce(new Error('Temporary network outage'))
      .mockResolvedValueOnce({ expiresAt: now + 3600, hasRefreshToken: true })
    ;(authService.getUser as jest.Mock).mockResolvedValue(membership)

    await act(async () => {
      jest.advanceTimersByTime(2000)
      await Promise.resolve()
    })

    expect(screen.getByTestId('status')).toHaveTextContent('authenticated')
    expect(authService.clearTokensIfUnchanged).not.toHaveBeenCalled()
    expect(authService.refreshTokens).toHaveBeenCalledTimes(1)

    await act(async () => {
      jest.advanceTimersByTime(16_000)
      await Promise.resolve()
    })
    expect(authService.refreshTokens).toHaveBeenCalledTimes(2)
    expect(screen.getByTestId('status')).toHaveTextContent('authenticated')
  })

  it('syncs rotated metadata from another tab after focus without rotating again', async () => {
    await mountWithToken(now + 3600)
    ;(authService.getStoredTokens as jest.Mock).mockResolvedValue({
      expiresAt: now + 7200,
      hasRefreshToken: true,
    })
    ;(authService.getUser as jest.Mock).mockResolvedValue(membership)

    await act(async () => {
      window.dispatchEvent(new Event('focus'))
      await Promise.resolve()
    })
    expect(authService.refreshTokens).not.toHaveBeenCalled()
    expect(authService.getUser).toHaveBeenCalledTimes(2)
    expect(screen.getByTestId('status')).toHaveTextContent('authenticated')
  })

  it('keeps newer rotated session when stale failure cleanup loses the race', async () => {
    const newer = {
      expiresAt: now + 3600,
      hasRefreshToken: true,
      sessionRevision: '22222222-2222-4222-8222-222222222222',
    }
    await mountWithToken(now + 61)
    ;(authService.refreshTokens as jest.Mock).mockResolvedValue(null)
    ;(authService.getUser as jest.Mock).mockResolvedValue(membership)
    ;(authService.clearTokensIfUnchanged as jest.Mock).mockResolvedValue(false)
    // First read and post-refresh read still see the stale revision. Only
    // after conditional deletion loses the race does the newer revision appear.
    ;(authService.getStoredTokens as jest.Mock)
      .mockResolvedValueOnce({ expiresAt: now + 61, hasRefreshToken: true })
      .mockResolvedValueOnce({ expiresAt: now + 61, hasRefreshToken: true })
      .mockResolvedValue(newer)

    await act(async () => {
      jest.advanceTimersByTime(2000)
      await Promise.resolve()
    })

    expect(authService.clearTokensIfUnchanged).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('status')).toHaveTextContent('authenticated')
    expect(screen.getByTestId('company')).toHaveTextContent('company-1')
  })

  it('revalidates backend roles after focus even when cookie expiry is unchanged', async () => {
    await mountWithToken(now + 3600)
    ;(authService.getUser as jest.Mock).mockResolvedValue(null)

    await act(async () => {
      window.dispatchEvent(new Event('focus'))
      await Promise.resolve()
    })

    expect(screen.getByTestId('status')).toHaveTextContent('unauthenticated')
    expect(authService.clearTokensIfUnchanged).toHaveBeenCalledTimes(1)
  })

  it('honors the 15-second retry backoff when focus fires repeatedly', async () => {
    await mountWithToken(now + 61)
    ;(authService.refreshTokens as jest.Mock).mockRejectedValue(new Error('Temporary network outage'))
    ;(authService.getUser as jest.Mock).mockResolvedValue(membership)

    await act(async () => {
      jest.advanceTimersByTime(2000)
      await Promise.resolve()
    })
    expect(authService.refreshTokens).toHaveBeenCalledTimes(1)

    await act(async () => {
      window.dispatchEvent(new Event('focus'))
      document.dispatchEvent(new Event('visibilitychange'))
      await Promise.resolve()
    })
    expect(authService.refreshTokens).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('status')).toHaveTextContent('authenticated')
    expect(screen.getByTestId('company')).toHaveTextContent('company-1')
  })

  it('revalidates a concurrently rotated cookie after an initial backend outage', async () => {
    const expired = {
      expiresAt: now - 5,
      hasRefreshToken: true,
      sessionRevision: 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa',
    }
    const newer = {
      expiresAt: now + 3600,
      hasRefreshToken: true,
      sessionRevision: 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb',
    }
    ;(authService.getStoredTokens as jest.Mock).mockResolvedValueOnce(expired).mockResolvedValue(newer)
    ;(authService.refreshTokens as jest.Mock).mockResolvedValue(null)
    ;(authService.clearTokensIfUnchanged as jest.Mock).mockResolvedValue(false)
    ;(authService.getUser as jest.Mock).mockRejectedValueOnce(new Error('backend temporarily offline'))
    ;(authService.getUser as jest.Mock).mockResolvedValue(membership)

    await act(async () => {
      render(
        <AuthProvider>
          <AuthState />
        </AuthProvider>
      )
    })

    expect(screen.getByTestId('status')).toHaveTextContent('loading')
    expect(authService.clearTokensIfUnchanged).toHaveBeenCalledTimes(1)

    await act(async () => {
      await jest.advanceTimersByTimeAsync(15_100)
    })

    expect(screen.getByTestId('status')).toHaveTextContent('authenticated')
    expect(screen.getByTestId('company')).toHaveTextContent('company-1')
    expect(authService.clearTokensIfUnchanged).toHaveBeenCalledTimes(1)
  })

  it('retains independently verified permissions after a temporary refresh network error', async () => {
    await mountWithToken(now + 61)
    ;(authService.refreshTokens as jest.Mock).mockRejectedValue(new Error('network unavailable'))
    ;(authService.getUser as jest.Mock).mockResolvedValue(membership)

    await act(async () => {
      jest.advanceTimersByTime(2000)
      await Promise.resolve()
    })

    expect(screen.getByTestId('status')).toHaveTextContent('authenticated')
    expect(screen.getByTestId('company')).toHaveTextContent('company-1')
    expect(authService.clearTokensIfUnchanged).not.toHaveBeenCalled()
  })

  it('retains the refresh cookie when a temporary outage crosses access-token expiry', async () => {
    ;(authService.getStoredTokens as jest.Mock).mockResolvedValue({
      expiresAt: now + 5,
      hasRefreshToken: true,
    })
    ;(authService.refreshTokens as jest.Mock).mockRejectedValue(new Error('Zitadel unavailable'))
    ;(authService.getUser as jest.Mock).mockResolvedValue(membership)

    await act(async () => {
      render(
        <AuthProvider>
          <AuthState />
        </AuthProvider>
      )
    })
    expect(screen.getByTestId('status')).toHaveTextContent('authenticated')

    await act(async () => {
      await jest.advanceTimersByTimeAsync(6_000)
    })

    expect(screen.getByTestId('status')).toHaveTextContent('loading')
    expect(screen.getByTestId('company')).toHaveTextContent('none')
    expect(authService.clearTokensIfUnchanged).not.toHaveBeenCalled()
  })

  it('does not accept an older account verification after a newer focus result', async () => {
    await mountWithToken(now + 3600)
    let resolveFirst: ((value: typeof membership) => void) | undefined
    let resolveSecond: ((value: typeof membership) => void) | undefined
    const firstVerification = new Promise<typeof membership>((resolve) => {
      resolveFirst = resolve
    })
    const secondVerification = new Promise<typeof membership>((resolve) => {
      resolveSecond = resolve
    })
    ;(authService.getUser as jest.Mock).mockReturnValueOnce(firstVerification).mockReturnValueOnce(secondVerification)
    await act(async () => {
      window.dispatchEvent(new Event('focus'))
      await Promise.resolve()
      await Promise.resolve()
    })
    expect(resolveFirst).toBeDefined()
    await act(async () => {
      window.dispatchEvent(new Event('focus'))
      await Promise.resolve()
      await Promise.resolve()
    })
    expect(resolveSecond).toBeDefined()
    await act(async () => {
      resolveSecond?.({ ...membership, companyId: 'company-2' })
      await Promise.resolve()
    })
    await act(async () => {
      resolveFirst?.(membership)
      await Promise.resolve()
    })
    expect(screen.getByTestId('company')).toHaveTextContent('company-2')
  })
})
