import { renderToStaticMarkup } from 'react-dom/server'
import { redirect } from 'next/navigation'

import SelectCompanyPage from '@/app/[locale]/select-company/page'
import { getServerSession } from '@/lib/auth/server'

jest.mock('next/navigation', () => ({
  redirect: jest.fn((path: string) => {
    throw new Error('NEXT_REDIRECT:' + path)
  }),
}))
jest.mock('@/lib/auth/server', () => ({ getServerSession: jest.fn() }))

const getSession = getServerSession as jest.MockedFunction<typeof getServerSession>

const firstCompany = { id: 'aaaaaaaaaaaaaaaaaaaaaaaa', name: 'Company A' }
const secondCompany = { id: 'bbbbbbbbbbbbbbbbbbbbbbbb', name: 'Company B' }

async function render(locale = 'en') {
  const node = await SelectCompanyPage({ params: Promise.resolve({ locale }) })
  return renderToStaticMarkup(node)
}

function respondWithCompanies(options: Array<{ id: string; name: string }>) {
  ;(global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => options,
  })
}

describe('company selection page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    getSession.mockResolvedValue({
      OAuthToken: 'server-only-token',
      user: {
        id: 'user-1',
        name: 'User',
        email: 'user@example.test',
        role: 'user',
        companyId: firstCompany.id,
        companyRole: 'manager',
      },
    })
    global.fetch = jest.fn() as unknown as typeof fetch
  })

  it('shows only backend memberships and the active company', async () => {
    respondWithCompanies([firstCompany, secondCompany])
    const html = await render()
    expect(html).toContain(firstCompany.name)
    expect(html).toContain(secondCompany.name)
    expect(html).toContain('Active')
    expect(html.match(/name="companyId"/g)).toHaveLength(2)
    expect(html).not.toContain('server-only-token')
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/companies/mine'),
      expect.objectContaining({
        headers: { Authorization: 'Bearer server-only-token' },
        cache: 'no-store',
      })
    )
  })

  it('handles one company, no companies and revoked selection', async () => {
    respondWithCompanies([firstCompany])
    expect((await render()).match(/name="companyId"/g)).toHaveLength(1)

    respondWithCompanies([])
    expect(await render()).toContain('No companies are available')

    respondWithCompanies([secondCompany])
    const html = await render()
    expect(html).toContain(secondCompany.name)
    expect(html).not.toContain('Active')
  })

  it('fails closed when the membership API fails', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 503 })
    const html = await render()
    expect(html).toContain('Unable to load companies')
    expect(html).not.toContain('name="companyId"')
  })

  it('rejects guests and platform administrators', async () => {
    getSession.mockResolvedValueOnce(null)
    await expect(render()).rejects.toThrow('NEXT_REDIRECT:/en/auth')
    getSession.mockResolvedValueOnce({
      user: { id: 'user-1', name: 'Admin', email: 'a@example.test', role: 'admin' },
      OAuthToken: 'server-only-token',
    })
    await expect(render()).rejects.toThrow('NEXT_REDIRECT:/en/admin')
    expect(redirect).toHaveBeenCalledTimes(2)
    expect(global.fetch).not.toHaveBeenCalled()
  })
})
