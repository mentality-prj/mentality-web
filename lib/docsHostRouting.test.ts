import { getDocsHostRoute } from './docsHostRouting'

describe('docs.dzvin.co host boundary', () => {
  it('keeps the existing website and preview domains unchanged', () => {
    expect(getDocsHostRoute('www.dzvin.co', '/', 'uk')).toBeNull()
    expect(getDocsHostRoute('docs.dzvin.co.evil.example', '/api', 'uk')).toBeNull()
  })
  it('opens documentation at the root or a bare locale', () => {
    expect(getDocsHostRoute('docs.dzvin.co', '/', 'uk')).toEqual({ action: 'redirect', destination: '/uk/docs' })
    expect(getDocsHostRoute('docs.dzvin.co', '/', 'pl')).toEqual({ action: 'redirect', destination: '/pl/docs' })
    expect(getDocsHostRoute('docs.dzvin.co', '/en', 'uk')).toEqual({ action: 'redirect', destination: '/en/docs' })
    expect(getDocsHostRoute('docs.dzvin.co', '/docs/personal', 'en')).toEqual({
      action: 'redirect',
      destination: '/en/docs/personal',
    })
  })
  it('permits only locale-specific documentation pages', () => {
    for (const locale of ['uk', 'en', 'pl']) {
      expect(getDocsHostRoute('docs.dzvin.co', `/${locale}/docs`, 'uk')).toEqual({ action: 'allow' })
      expect(getDocsHostRoute('docs.dzvin.co', `/${locale}/docs/personal`, 'uk')).toEqual({ action: 'allow' })
    }
  })
  it('does not expose application APIs or login callback', () => {
    for (const path of ['/api', '/api/users', '/callback']) {
      expect(getDocsHostRoute('docs.dzvin.co', path, 'en')).toEqual({ action: 'not-found' })
    }
  })
  it('sends non-documentation links to the main website', () => {
    expect(getDocsHostRoute('docs.dzvin.co', '/uk/privacy', 'uk')).toEqual({
      action: 'redirect',
      destination: '/uk/privacy',
      mainSite: true,
    })
  })
})
