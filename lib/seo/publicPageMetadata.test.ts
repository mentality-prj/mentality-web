import { publicPageMetadata } from './publicPageMetadata'

describe('Dzvin public landing SEO', () => {
  it.each([
    { locale: 'uk', path: '/', expected: '/uk', og: 'uk_UA' },
    { locale: 'en', path: '/', expected: '/en', og: 'en_US' },
    { locale: 'pl', path: '/', expected: '/pl', og: 'pl_PL' },
  ] as const)('returns a canonical URL for $locale $path', ({ locale, path, expected, og }) => {
    const meta = publicPageMetadata({
      locale,
      path,
      title: 'Human-centered Dzvin',
      description: 'Daily self-support for people.',
    })
    expect(meta.metadataBase?.toString()).toBe('https://www.dzvin.co/')
    expect(meta.alternates?.canonical).toBe(expected)
    expect(meta.alternates?.languages).toEqual({
      uk: path === '/' ? '/uk' : '/uk' + path,
      en: path === '/' ? '/en' : '/en' + path,
      pl: path === '/' ? '/pl' : '/pl' + path,
      'x-default': path === '/' ? '/uk' : '/uk' + path,
    })
    expect(meta.openGraph).toEqual(
      expect.objectContaining({
        title: 'Human-centered Dzvin',
        description: 'Daily self-support for people.',
        locale: og,
        url: 'https://www.dzvin.co' + expected,
      })
    )
  })

  it('does not use user state, journal content, or unsupported product metrics', () => {
    const metadata = publicPageMetadata({
      locale: 'uk',
      path: '/',
      title: 'Dzvin',
      description: 'Private self-support',
    })
    expect(JSON.stringify(metadata)).not.toContain('725+')
    expect(JSON.stringify(metadata)).not.toContain('userId')
    expect(JSON.stringify(metadata)).not.toContain('moodLevel')
  })
})
