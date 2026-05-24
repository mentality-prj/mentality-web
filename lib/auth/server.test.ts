const mockedCookies = jest.fn()
const mockedRedirect = jest.fn()
const mockedLogger = {
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
}

jest.mock('next/headers', () => ({
  cookies: mockedCookies,
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
      }),
    })

    const { getServerSession } = await import('./server')
    const session = await getServerSession()

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

  it('returns null when backend rejects the token', async () => {
    setTokenCookie()
    fetchMock.mockResolvedValue({ ok: false, status: 401 })

    const { getServerSession } = await import('./server')
    const session = await getServerSession()

    expect(session).toBeNull()
  })

  it('deduplicates validation within the same request scope', async () => {
    setTokenCookie()
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
