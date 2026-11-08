import { fireEvent, render, screen } from '@testing-library/react'
import { readFileSync } from 'node:fs'

import { MoodResonance, moodWater } from './MoodResonance'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

describe('MoodResonance', () => {
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
  it('preserves the turquoise ripple artwork without masked or filtered pseudo-layer compositing', () => {
    const css = readFileSync('styles/globals.css', 'utf8')
    const readyAfter = css.match(/\.hero-zen\[data-hero-rings-ready='true'\]::after\s*\{([^}]*)\}/)?.[1]
    const rings = css.match(/\.hero-zen::after\s*\{([\s\S]*?)\n\}/)?.[1]

    expect(readyAfter).toContain('opacity: 1')
    expect(readyAfter).not.toMatch(/\bfilter\s*:/)
    expect(rings).toContain('radial-gradient(')
    expect(rings).not.toMatch(/(?:-webkit-)?mask\s*:/)
  })
})
