import { fireEvent, render, screen } from '@testing-library/react'
import { readFileSync } from 'node:fs'

import { MoodResonance, moodWater } from './MoodResonance'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

const mockDrop = jest.fn()
jest.mock('./water/WaterSurface', () => {
  const React = jest.requireActual<typeof import('react')>('react')
  return {
    WaterSurface: React.forwardRef(function MockWaterSurface(
      _props: unknown,
      ref: React.ForwardedRef<{ drop: (x: number, y: number, strength?: number) => void }>
    ) {
      React.useImperativeHandle(ref, () => ({ drop: mockDrop }))
      return null
    }),
  }
})

describe('MoodResonance', () => {
  afterEach(() => {
    mockDrop.mockClear()
    jest.restoreAllMocks()
  })

  it('starts a single logo-centered ripple on load and ignores pointer and slider changes', () => {
    const logo = document.createElement('div')
    logo.dataset.landingLogo = 'true'
    document.body.appendChild(logo)
    jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      const isLogo = this === logo
      const left = isLogo ? 150 : 0
      const top = isLogo ? 20 : 100
      const width = isLogo ? 100 : 400
      const height = isLogo ? 40 : 400
      return {
        x: left,
        y: top,
        left,
        top,
        width,
        height,
        right: left + width,
        bottom: top + height,
        toJSON: () => ({}),
      }
    })
    try {
      render(
        <MoodResonance>
          <p>hero copy</p>
        </MoodResonance>
      )
      expect(mockDrop).toHaveBeenCalledTimes(1)
      expect(mockDrop).toHaveBeenCalledWith(0.5, 0.03, 0.9)
      fireEvent.pointerDown(screen.getByText('hero copy'), { clientX: 80, clientY: 240 })
      fireEvent.change(screen.getByLabelText('checkin'), { target: { value: '80' } })
      expect(mockDrop).toHaveBeenCalledTimes(1)
      expect(screen.getByLabelText('checkin')).toHaveAttribute('aria-valuetext', 'moodHigh')
    } finally {
      logo.remove()
    }
  })

  it('keeps demo action cards in one column when the hero is narrow', () => {
    render(
      <MoodResonance>
        <p>hero copy</p>
      </MoodResonance>
    )
    const cards = screen.getByText('journal').parentElement?.parentElement
    expect(cards).toHaveClass('grid-cols-1', 'sm:grid-cols-2', 'md:grid-cols-1', 'lg:grid-cols-2')
  })

  it('maps mood to calm-blue, lilac and warm water', () => {
    expect(moodWater(0).deep).toBe('#9db4ea')
    expect(moodWater(50).deep).toBe('#c6b2f1')
    expect(moodWater(100).deep).toBe('#f3b58e')
    expect(moodWater(-20)).toEqual(moodWater(0))
  })

  it('renders an accessible mood slider that re-tints the hero', () => {
    render(
      <MoodResonance className="grid">
        <p>hero copy</p>
      </MoodResonance>
    )
    const slider = screen.getByLabelText('checkin')
    expect(screen.getByText('hero copy')).toBeInTheDocument()
    expect(screen.getByText('moodHint')).toBeInTheDocument()

    fireEvent.change(slider, { target: { value: '100' } })
    expect(slider).toHaveAttribute('aria-valuetext', 'moodHigh')
    expect(slider).toHaveStyle({ '--r2': '#f3b58e' })
  })
})

describe('Hero ring compositing', () => {
  it('halves only the hero rings speed and preserves the ripple lifetime', () => {
    const css = readFileSync('styles/globals.css', 'utf8')
    const hero = readFileSync('app/[locale]/(public)/components/MoodResonance.tsx', 'utf8')
    const water = readFileSync('app/[locale]/(public)/components/water/WaterSurface.tsx', 'utf8')

    expect(css).toContain('opacity 1040ms')
    expect(css).toContain('transform 2400ms')
    expect(css).toContain('filter 1800ms')
    expect(hero).toContain('timeScale={0.5}')
    expect(hero).toContain('every={8}')
    expect(water).toContain('6500 / timeScale')
  })

  it('removes the CSS concentric-ring layer while preserving the soft wash and on-load water ripple', () => {
    const css = readFileSync('styles/globals.css', 'utf8')
    const hero = readFileSync('app/[locale]/(public)/components/MoodResonance.tsx', 'utf8')

    expect(css).not.toContain('.hero-zen::after')
    expect(css).not.toContain(']::after')
    expect(css).toContain('.hero-zen::before {')
    expect(hero).toMatch(/<WaterSurface\s+ref=\{water\}/)
    expect(hero).toContain('water.current?.drop(')
  })
})
