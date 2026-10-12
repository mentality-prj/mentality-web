describe('requests/config', () => {
  const originalBaseUrl = process.env.NEXT_PUBLIC_BASE_URL

  afterEach(() => {
    if (originalBaseUrl === undefined) {
      delete process.env.NEXT_PUBLIC_BASE_URL
    } else {
      process.env.NEXT_PUBLIC_BASE_URL = originalBaseUrl
    }
    jest.resetModules()
  })

  it('uses the default URL when NEXT_PUBLIC_BASE_URL is missing', async () => {
    delete process.env.NEXT_PUBLIC_BASE_URL
    jest.resetModules()
    const { APPUrl } = await import('./config')
    expect(APPUrl).toBe('http://localhost:3000/api')
  })

  it('normalizes trailing slashes', async () => {
    process.env.NEXT_PUBLIC_BASE_URL = 'https://dzvin.co///'
    jest.resetModules()
    const { APPUrl } = await import('./config')
    expect(APPUrl).toBe('https://dzvin.co/api')
  })

  it('uses the default URL when NEXT_PUBLIC_BASE_URL is blank', async () => {
    process.env.NEXT_PUBLIC_BASE_URL = '  '
    jest.resetModules()
    const { APPUrl } = await import('./config')
    expect(APPUrl).toBe('http://localhost:3000/api')
  })
})
