import { render, screen, waitFor } from '@testing-library/react'
import { usePathname } from 'next/navigation'

import { SessionWrapper } from '@/components/shared/SessionWrapper'
import { useAuth } from '@/context/AuthProvider'

jest.mock('@/context/AuthProvider')
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))
jest.mock('@/lib/logger', () => ({
  logger: { warn: jest.fn(), error: jest.fn(), info: jest.fn() },
}))

const mockUseAuth = useAuth as jest.Mock
const mockUsePathname = usePathname as jest.Mock
const mockLogout = jest.fn()

describe('SessionWrapper Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUsePathname.mockReturnValue('/en/dashboard')
    mockUseAuth.mockReturnValue({ session: null, logout: mockLogout })
  })

  it('renders children without issues', () => {
    render(
      <SessionWrapper>
        <div>Test Child</div>
      </SessionWrapper>
    )
    expect(screen.getByText('Test Child')).toBeInTheDocument()
  })

  it('does not sign out when session is valid', () => {
    mockUseAuth.mockReturnValue({
      session: { user: { email: 'test@example.com' }, OAuthToken: 'valid-token' },
      logout: mockLogout,
    })
    render(
      <SessionWrapper>
        <div>Content</div>
      </SessionWrapper>
    )
    expect(mockLogout).not.toHaveBeenCalled()
  })

  it('signs out when refresh token error occurs', async () => {
    mockUseAuth.mockReturnValue({
      session: { error: { error: 'RefreshTokenError', message: 'Token expired' } },
      logout: mockLogout,
    })
    render(
      <SessionWrapper>
        <div>Content</div>
      </SessionWrapper>
    )
    await waitFor(() => expect(mockLogout).toHaveBeenCalled())
  })

  it('signs out for backend connection error', async () => {
    mockUseAuth.mockReturnValue({
      session: { error: 'BackendConnectionError' },
      logout: mockLogout,
    })
    render(
      <SessionWrapper>
        <div>Content</div>
      </SessionWrapper>
    )
    await waitFor(() => expect(mockLogout).toHaveBeenCalled())
  })

  it('signs out for invalid token error', async () => {
    mockUseAuth.mockReturnValue({
      session: { error: 'InvalidToken' },
      logout: mockLogout,
    })
    render(
      <SessionWrapper>
        <div>Content</div>
      </SessionWrapper>
    )
    await waitFor(() => expect(mockLogout).toHaveBeenCalled())
  })

  it('handles undefined session error gracefully', () => {
    mockUseAuth.mockReturnValue({
      session: { user: { email: 'test@example.com' }, error: undefined },
      logout: mockLogout,
    })
    render(
      <SessionWrapper>
        <div>Content</div>
      </SessionWrapper>
    )
    expect(mockLogout).not.toHaveBeenCalled()
  })

  it('re-evaluates session when it changes', async () => {
    const { rerender } = render(
      <SessionWrapper>
        <div>Content</div>
      </SessionWrapper>
    )
    mockUseAuth.mockReturnValue({
      session: { error: { error: 'RefreshTokenError', message: 'Token expired' } },
      logout: mockLogout,
    })
    rerender(
      <SessionWrapper>
        <div>Content</div>
      </SessionWrapper>
    )
    await waitFor(() => expect(mockLogout).toHaveBeenCalled())
  })
})
