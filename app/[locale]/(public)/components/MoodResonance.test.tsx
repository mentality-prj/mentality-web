import { fireEvent, render, screen } from '@testing-library/react'

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
