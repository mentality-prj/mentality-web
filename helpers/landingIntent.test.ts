import { consumeLandingIntent, rememberLandingIntent } from './landingIntent'

describe('Public landing intent and OAuth destination', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-10-21T10:00:00.000Z'))
  })

  afterEach(() => {
    window.sessionStorage.clear()
    jest.useRealTimers()
  })

  it('retains one intended private feature during login and consumes it only once', () => {
    rememberLandingIntent('mood')
    expect(consumeLandingIntent()).toBe('/mood-tracker')
    expect(consumeLandingIntent()).toBeNull()

    rememberLandingIntent('diary')
    expect(consumeLandingIntent()).toBe('/diary')
  })

  it('ignores stale intent after ten minutes', () => {
    rememberLandingIntent('diary')
    jest.advanceTimersByTime(11 * 60 * 1000)
    expect(consumeLandingIntent()).toBeNull()
  })

  it('rejects tampered destinations rather than allowing an open redirect', () => {
    window.sessionStorage.setItem(
      'dzvin:landing-intent:v1',
      JSON.stringify({ intent: 'https://example.com', createdAt: Date.now() })
    )
    expect(consumeLandingIntent()).toBeNull()
    expect(window.sessionStorage.length).toBe(0)
  })
})
