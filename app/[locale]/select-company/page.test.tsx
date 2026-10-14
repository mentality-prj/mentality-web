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

function company(id: string, name: string) {
  return { id, name }
}

async function render(locale = 'en') {
  const node = await SelectCompanyPage({ params: Promise.resolve({ locale }) })
  return renderToStaticMarkup(node)
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
        companyId: 'aaaaaaaaaaaaaaaaaaaaaaaa',
        companyRole: 'manager',
      },
    })
    const memberships = [
      company('aaaaaaaaaaaaaaaaaaaaaaaa', 'Company A'),
      company('bbbbbbbbbbbbbbbbbbbbbbbb', 'Company B'),
    ]
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => memberships }) as unknown as typeof fetch
  })

  it('shows multiple memberships with only one marked as selected', async () => {
    const html = await render()
    expect(html).toContain('Company A')
    expect(html).toContain('Company B')
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

  it('supports one company, no companies and lost membership', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [company('aaaaaaaaaaaaaaaaaaaaaaaa', 'Company A')],
    })
    expect((await render()).match(/name="companyId"/g)).toHaveLength(1)

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => [] })
    expect(await render()).toContain('No companies are available')

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [company('bbbbbbbbbbbbbbbbbbbbbbbb', 'Company B')],
    })
    const html = await render()
    expect(html).toContain('Company B')
    expect(html).not.toContain('Active')
  })

  it('fails closed on a backend error instead of displaying invented companies', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 503 })
    const html = await render()
    expect(html).toContain('Unable to load companies')
    expect(html).not.toContain('name="companyId"')
  })

  it('rejects guests and platform administrators before contacting the company API', async () => {
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
