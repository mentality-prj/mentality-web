import { render, screen } from '@testing-library/react'
import { headers } from 'next/headers'

import ProtectedLayout from '@/app/[locale]/(protected)/layout'
import { getUserSidebarMenu } from '@/constants/menu'
import { Routes } from '@/constants/routes'
import { requireServerSession } from '@/lib/auth/server'
import { getResearchWorkspaceAccess } from '@/requests/researchProjects'
import { CustomSession } from '@/types/auth'

jest.mock('@/lib/auth/server', () => ({ requireServerSession: jest.fn() }))
jest.mock('@/constants/menu', () => ({ getUserSidebarMenu: jest.fn() }))
jest.mock('next/headers', () => ({ headers: jest.fn() }))
jest.mock('@/requests/researchProjects', () => ({ getResearchWorkspaceAccess: jest.fn() }))

jest.mock('@/components/features/Landing', () => ({
  LandingFooter: () => <div data-testid="landing-footer" />,
}))

jest.mock('@/components/Layout/Header', () => ({
  Header: () => <div data-testid="header" />,
}))

jest.mock('@/components/Layout/mainVariants', () => ({
  mainVariants: () => '',
}))

jest.mock('@/components/Layout/Sidebar/Sidebar', () => ({
  __esModule: true,
  default: () => <div data-testid="sidebar" />,
}))

jest.mock('@/components/Layout/ProtectedLayoutSegmentGate', () => ({
  __esModule: true,
  default: ({ defaultContent }: { defaultContent: React.ReactNode }) => <>{defaultContent}</>,
}))

jest.mock('@/lib/utils', () => ({
  cn: (...values: Array<string | false | null | undefined>) => values.filter(Boolean).join(' '),
}))

const mockSession: CustomSession = {
  user: { id: 'user-1', name: 'Protected User', email: 'protected.user@example.com', role: 'user' },
  OAuthToken: 'mock-token',
  expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
}

beforeEach(() => {
  jest.clearAllMocks()
  ;(requireServerSession as jest.Mock).mockResolvedValue(mockSession)
  ;(getUserSidebarMenu as jest.Mock).mockReturnValue([{ href: Routes.MYDAY, title: 'My day' }])
  ;(getResearchWorkspaceAccess as jest.Mock).mockResolvedValue({
    data: {
      hasAccess: false,
      canCreateProjects: false,
      capabilities: [],
      companies: [],
      scientists: [],
    },
  })
  ;(headers as jest.Mock).mockReturnValue(new Headers({ 'x-pathname': '/en/my-day' }))
})

describe('Protected layout', () => {
  it('redirects before loading the sidebar menu when the session is missing', async () => {
    ;(requireServerSession as jest.Mock).mockRejectedValue(new Error('NEXT_REDIRECT:/en/auth'))

    await expect(
      ProtectedLayout({
        children: <div>Protected content</div>,
        params: Promise.resolve({ locale: 'en' }),
      })
    ).rejects.toThrow('NEXT_REDIRECT:/en/auth')

    expect(requireServerSession).toHaveBeenCalledWith(`/en${Routes.AUTH}`)
    expect(getUserSidebarMenu).not.toHaveBeenCalled()
  })

  it('includes Research in the sidebar when workspace access exists', async () => {
    ;(getResearchWorkspaceAccess as jest.Mock).mockResolvedValue({
      data: {
        hasAccess: true,
        canCreateProjects: false,
        capabilities: [],
        companies: [],
        scientists: [],
      },
    })

    render(
      await ProtectedLayout({
        children: <div>Protected content</div>,
        params: Promise.resolve({ locale: 'en' }),
      })
    )

    expect(getUserSidebarMenu).toHaveBeenCalledWith({ includeResearch: true })
  })

  it('loads the shared sidebar menu and renders children when the session is present', async () => {
    render(
      await ProtectedLayout({
        children: <div>Protected content</div>,
        params: Promise.resolve({ locale: 'en' }),
      })
    )

    expect(requireServerSession).toHaveBeenCalledWith(`/en${Routes.AUTH}`)
    expect(getUserSidebarMenu).toHaveBeenCalledWith({ includeResearch: false })
    expect(screen.getByText('Protected content')).toBeInTheDocument()
    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
  })
})
