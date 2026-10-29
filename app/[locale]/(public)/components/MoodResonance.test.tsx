import { fireEvent, render, screen } from '@testing-library/react'

import { moodPalette, MoodResonance } from './MoodResonance'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

describe('MoodResonance', () => {
  it('maps mood to a calm-to-warm palette', () => {
    expect(moodPalette(0)[0]).toBe('rgb(169 196 245)')
    expect(moodPalette(50)[1]).toBe('rgb(204 167 255)')
    expect(moodPalette(100)[0]).toBe('rgb(255 207 138)')
    expect(moodPalette(-20)).toEqual(moodPalette(0))
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
    const card = slider.closest('[style*="--r1"]') as HTMLElement
    expect(card.style.getPropertyValue('--r1')).toBe('rgb(255 207 138)')
  })
})
