const mockedCookies = jest.fn()
const mockedHeaders = jest.fn()
const mockedRedirect = jest.fn()
const mockedLogger = {
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
}

jest.mock('next/headers', () => ({
  cookies: mockedCookies,
  headers: mockedHeaders,
}))

jest.mock('next/navigation', () => ({
  redirect: mockedRedirect,
}))

jest.mock('@/lib/logger', () => ({
  logger: mockedLogger,
}))

function createJwt(payload: Record<string, unknown>): string {
  const encoded = Buffer.from(JSON.stringify(payload))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')

  return `header.${encoded}.signature`
}

function setTokenCookie(overrides: Record<string, unknown> = {}) {
  const tokens = {
    accessToken: createJwt({ sub: 'user-1' }),
    idToken: createJwt({ sub: 'user-1', email: 'test@example.com', name: 'Test User' }),
    expiresAt: Math.floor(Date.now() / 1000) + 3600,
    ...overrides,
  }

  mockedCookies.mockReturnValue({
    get: jest.fn().mockReturnValue({ value: JSON.stringify(tokens) }),
  })

  return tokens
}

const fetchMock = jest.fn()

describe('server auth session helpers', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    mockedRedirect.mockImplementation((path: string) => {
      throw new Error(`NEXT_REDIRECT:${path}`)
    })
    mockedHeaders.mockReturnValue(new Headers())
    global.fetch = fetchMock as unknown as typeof fetch
  })

  it('returns backend user when validate-token succeeds', async () => {
    const tokens = setTokenCookie()
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        _id: 'backend-user',
        name: 'Backend User',
        email: 'backend@example.com',
        avatarUrl: 'https://example.com/avatar.png',
        role: 'user',
        companyId: 'company-1',
        companyRole: 'manager',
      }),
    })

    const { getServerSession } = await import('./server')
    const session = await getServerSession()
    expect(fetchMock.mock.calls[0][1].signal).toBeDefined()

    expect(session).toEqual({
      OAuthToken: tokens.accessToken,
      user: {
        id: 'backend-user',
        name: 'Backend User',
        email: 'backend@example.com',
        image: 'https://example.com/avatar.png',
        role: 'user',
        companyId: 'company-1',
        companyRole: 'manager',
        isAIAuthorized: true,
      },
    })
  })

  it('uses an HttpOnly selected company hint in backend verification and separates cache keys', async () => {
    const tokens = setTokenCookie()
    const firstCompanyId = 'aaaaaaaaaaaaaaaaaaaaaaaa'
    const secondCompanyId = 'bbbbbbbbbbbbbbbbbbbbbbbb'
    let selectedCompanyId = firstCompanyId
    mockedCookies.mockReturnValue({
      get: (name: string) => ({
        value: name === 'dzvin-active-company' ? selectedCompanyId : JSON.stringify(tokens),
      }),
    })
    mockedHeaders.mockReturnValue(new Headers({ 'x-request-id': 'same-request' }))
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        _id: 'backend-user',
        name: 'User',
        email: 'u@example.test',
        companyId: selectedCompanyId,
        companyRole: 'manager',
      }),
    })

    const { getServerSession } = await import('./server')
    await getServerSession()
    expect(fetchMock.mock.calls[0][1].headers['x-company-id']).toBe(firstCompanyId)

    selectedCompanyId = secondCompanyId
    await getServerSession()
    expect(fetchMock.mock.calls[1][1].headers['x-company-id']).toBe(secondCompanyId)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('preserves the base login when an expired company context is rejected', async () => {
    const tokens = setTokenCookie()
    mockedCookies.mockReturnValue({
      get: (name: string) => ({
        value: name === 'dzvin-active-company' ? 'aaaaaaaaaaaaaaaaaaaaaaaa' : JSON.stringify(tokens),
      }),
    })
    fetchMock.mockResolvedValueOnce({ ok: false, status: 403 })
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        _id: 'backend-user',
        name: 'User',
        email: 'u@example.test',
        role: 'user',
      }),
    })

    const { getServerSession } = await import('./server')
    const session = await getServerSession()
    expect(session?.user?.id).toBe('backend-user')
    expect(session?.user?.companyId).toBeUndefined()
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock.mock.calls[1][1].headers['x-company-id']).toBeUndefined()
  })

  it('falls back to token-derived session when validation fetch fails', async () => {
    process.env.ALLOW_UNVERIFIED_JWT_SESSION_FALLBACK = 'true'
    const tokens = setTokenCookie()
    fetchMock.mockRejectedValue(new Error('fetch failed'))

    const { getServerSession } = await import('./server')
    const session = await getServerSession()

    expect(session).toEqual({
      OAuthToken: tokens.accessToken,
      user: {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
      },
    })
    expect(mockedLogger.error).toHaveBeenCalledWith('[SERVER_SESSION] Error fetching session', {
      error: 'fetch failed',
    })
    expect(mockedLogger.warn).toHaveBeenCalledWith('[SERVER_SESSION] Falling back to token-derived session')
    delete process.env.ALLOW_UNVERIFIED_JWT_SESSION_FALLBACK
  })

  it('propagates a temporary 503 in strict browser-session validation', async () => {
    setTokenCookie()
    fetchMock.mockResolvedValue({ ok: false, status: 503 })

    const { getServerSessionStrict } = await import('./server')
    await expect(getServerSessionStrict()).rejects.toThrow('Temporary session validation failure')
  })

  it('propagates network errors from strict validation instead of reporting bad credentials', async () => {
    setTokenCookie()
    fetchMock.mockRejectedValue(new Error('backend offline'))

    const { getServerSessionStrict } = await import('./server')
    await expect(getServerSessionStrict()).rejects.toThrow('Temporary session validation failure')
  })

  it('returns null when backend rejects the token', async () => {
    setTokenCookie()
    fetchMock.mockResolvedValue({ ok: false, status: 401 })

    const { getServerSession } = await import('./server')
    const session = await getServerSession()

    expect(session).toBeNull()
  })

  it('deduplicates validation within the same request scope', async () => {
    setTokenCookie()
    mockedHeaders.mockReturnValue(new Headers({ 'x-request-id': 'request-1' }))
    let resolveResponse: ((value: unknown) => void) | undefined
    fetchMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveResponse = resolve
        })
    )

    const { getServerSession } = await import('./server')
    const firstSessionPromise = getServerSession()
    const secondSessionPromise = getServerSession()

    // Await the asynchronous Next.js 16 cookies()/headers() boundary
    // before asserting that the backend request was deduplicated.
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(fetchMock).toHaveBeenCalledTimes(1)

    resolveResponse?.({
      ok: true,
      json: async () => ({
        _id: 'backend-user',
        name: 'Backend User',
        email: 'backend@example.com',
        avatarUrl: '',
        role: 'user',
      }),
    })

    await Promise.all([firstSessionPromise, secondSessionPromise])

    // A subsequent call in the same request scope should hit resolved cache.
    await getServerSession()
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('redirects from requireServerSession when no authenticated user is available', async () => {
    mockedCookies.mockReturnValue({
      get: jest.fn().mockReturnValue(undefined),
    })

    const { requireServerSession } = await import('./server')

    await expect(requireServerSession('/en/auth')).rejects.toThrow('NEXT_REDIRECT:/en/auth')
    expect(mockedRedirect).toHaveBeenCalledWith('/en/auth')
  })

  it('returns the authenticated session from requireServerSession', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        _id: 'backend-user',
        name: 'Backend User',
        email: 'backend@example.com',
        avatarUrl: 'https://example.com/avatar.png',
        role: 'user',
      }),
    })

    const tokens = setTokenCookie()
    const { requireServerSession } = await import('./server')
    const session = await requireServerSession('/en/auth')

    expect(session).toEqual({
      OAuthToken: tokens.accessToken,
      user: {
        id: 'backend-user',
        name: 'Backend User',
        email: 'backend@example.com',
        image: 'https://example.com/avatar.png',
        role: 'user',
        isAIAuthorized: true,
      },
    })
    expect(mockedRedirect).not.toHaveBeenCalled()
  })
  it('returns null when validation fetch fails in production environment', async () => {
    setTokenCookie()
    fetchMock.mockRejectedValue(new Error('fetch failed'))

    const originalEnv = process.env.NODE_ENV
    ;(process.env as Record<string, string>).NODE_ENV = 'production'

    try {
      const { getServerSession } = await import('./server')
      const session = await getServerSession()

      expect(session).toBeNull()
    } finally {
      if (originalEnv === undefined) {
        delete (process.env as Record<string, string>).NODE_ENV
      } else {
        ;(process.env as Record<string, string>).NODE_ENV = originalEnv
      }
    }
  })
})
