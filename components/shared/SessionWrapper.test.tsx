import { render, screen, waitFor } from '@testing-library/react'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

import { SessionWrapper } from '@/components/shared/SessionWrapper'

jest.mock('next-auth/react')
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))
jest.mock('@/lib/logger', () => ({
  logger: {
    warn: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}))

describe('SessionWrapper Component', () => {
  const mockSignOut = signOut as jest.MockedFunction<typeof signOut>
  const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>

  beforeEach(() => {
    jest.clearAllMocks()
    mockUsePathname.mockReturnValue('/en/dashboard')
  })

  it('renders children without issues', () => {
    ;(useSession as jest.Mock).mockReturnValue({ data: null })

    render(
      <SessionWrapper>
        <div>Test Child</div>
      </SessionWrapper>
    )

    expect(screen.getByText('Test Child')).toBeInTheDocument()
  })

  it('does not sign out when session is valid', () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: {
        user: { email: 'test@example.com' },
        OAuthToken: 'valid-token',
      },
    })

    render(
      <SessionWrapper>
        <div>Content</div>
      </SessionWrapper>
    )

    expect(mockSignOut).not.toHaveBeenCalled()
  })

  it('signs out when refresh token error occurs', async () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: {
        error: {
          error: 'RefreshTokenError',
          message: 'Token expired',
        },
      },
    })

    render(
      <SessionWrapper>
        <div>Content</div>
      </SessionWrapper>
    )

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledWith({
        callbackUrl: '/en/signin',
        redirect: true,
      })
    })
  })

  it('signs out for backend connection error', async () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: {
        error: 'BackendConnectionError',
      },
    })

    render(
      <SessionWrapper>
        <div>Content</div>
      </SessionWrapper>
    )

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledWith({
        callbackUrl: '/en/signin',
        redirect: true,
      })
    })
  })

  it('signs out for invalid token error', async () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: {
        error: 'InvalidToken',
      },
    })

    render(
      <SessionWrapper>
        <div>Content</div>
      </SessionWrapper>
    )

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledWith({
        callbackUrl: '/en/signin',
        redirect: true,
      })
    })
  })

  it('handles undefined session error gracefully', () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: {
        user: { email: 'test@example.com' },
        error: undefined,
      },
    })

    render(
      <SessionWrapper>
        <div>Content</div>
      </SessionWrapper>
    )

    expect(mockSignOut).not.toHaveBeenCalled()
  })

  it('re-evaluates session when it changes', async () => {
    const { rerender } = render(
      <SessionWrapper>
        <div>Content</div>
      </SessionWrapper>
    )

    ;(useSession as jest.Mock).mockReturnValue({
      data: {
        error: {
          error: 'RefreshTokenError',
          message: 'Token expired',
        },
      },
    })

    rerender(
      <SessionWrapper>
        <div>Content</div>
      </SessionWrapper>
    )

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled()
    })
  })
})
