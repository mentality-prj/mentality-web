import { render, waitFor } from '@testing-library/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'

import SessionRecoveryPage from '@/app/[locale]/refresh-session/page'
import { useAuth } from '@/context/AuthProvider'
import { authService } from '@/lib/auth'

jest.mock('next/navigation', () => ({ useRouter: jest.fn(), useSearchParams: jest.fn() }))
jest.mock('next-intl', () => ({ useLocale: jest.fn(), useTranslations: jest.fn() }))
jest.mock('@/context/AuthProvider', () => ({ useAuth: jest.fn() }))
jest.mock('@/lib/auth', () => ({ authService: { getStoredTokens: jest.fn() } }))

describe('cross-tab session recovery route', () => {
  const replace = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ replace })
    ;(useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('returnTo=%2Fuk%2Fmy-day'))
    ;(useLocale as jest.Mock).mockReturnValue('uk')
    ;(useTranslations as jest.Mock).mockReturnValue((key: string) => key)
  })

  it('revalidates a shared cookie even if this tab still reports unauthenticated', async () => {
    const ensureFreshSession = jest.fn().mockResolvedValue(true)
    ;(useAuth as jest.Mock).mockReturnValue({ status: 'unauthenticated', ensureFreshSession })

    render(<SessionRecoveryPage />)

    await waitFor(() => expect(ensureFreshSession).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/uk/my-day'))
    expect(authService.getStoredTokens).not.toHaveBeenCalled()
  })

  it('redirects to sign-in only after confirming that no cookie exists', async () => {
    const ensureFreshSession = jest.fn().mockResolvedValue(false)
    ;(useAuth as jest.Mock).mockReturnValue({ status: 'unauthenticated', ensureFreshSession })
    ;(authService.getStoredTokens as jest.Mock).mockResolvedValue(null)

    render(<SessionRecoveryPage />)

    await waitFor(() => expect(replace).toHaveBeenCalledWith('/uk/auth'))
  })

  it('preserves recovery state during a transient session metadata outage', async () => {
    const ensureFreshSession = jest.fn().mockResolvedValue(false)
    ;(useAuth as jest.Mock).mockReturnValue({ status: 'unauthenticated', ensureFreshSession })
    ;(authService.getStoredTokens as jest.Mock).mockRejectedValue(new Error('temporary outage'))

    render(<SessionRecoveryPage />)

    await waitFor(() => expect(authService.getStoredTokens).toHaveBeenCalledTimes(1))
    expect(replace).not.toHaveBeenCalled()
  })
})
