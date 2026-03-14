import { render, screen } from '@testing-library/react'
import { getTranslations } from 'next-intl/server'

import { MoodLevelBars } from '@/components/features/MoodTracker/MoodLevelBars/MoodLevelBars'

jest.mock('next-intl/server')

beforeEach(() => {
  ;(getTranslations as jest.Mock).mockResolvedValue((key: string) => key)
})

const defaultProps = {
  stressValue: 3,
  stressColor: 'hsl(0, 80%, 60%)',
  energyValue: 4,
  energyColor: 'hsl(120, 60%, 50%)',
  focusValue: 2,
  focusColor: 'hsl(200, 70%, 55%)',
}

describe('MoodLevelBars', () => {
  it('renders stress, energy and focus labels', async () => {
    render(await MoodLevelBars(defaultProps))

    expect(screen.getByText('stress')).toBeInTheDocument()
    expect(screen.getByText('energy')).toBeInTheDocument()
    expect(screen.getByText('focus')).toBeInTheDocument()
  })

  it('renders correct bar widths based on values (value * 20%)', async () => {
    render(await MoodLevelBars(defaultProps))

    const bars = document.querySelectorAll('[style]')
    const widths = Array.from(bars).map((el) => (el as HTMLElement).style.width)

    expect(widths).toContain('60%') // stressValue 3 * 20
    expect(widths).toContain('80%') // energyValue 4 * 20
    expect(widths).toContain('40%') // focusValue 2 * 20
  })

  it('applies background colors to bars (one per metric)', async () => {
    render(await MoodLevelBars(defaultProps))

    // Each colored bar div has both width and backgroundColor styles
    const coloredBars = Array.from(document.querySelectorAll('[style]')).filter(
      (el) => (el as HTMLElement).style.backgroundColor !== ''
    )

    expect(coloredBars).toHaveLength(3)
    coloredBars.forEach((bar) => {
      expect((bar as HTMLElement).style.backgroundColor).not.toBe('')
    })
  })

  it('applies custom className to the wrapper', async () => {
    const { container } = render(await MoodLevelBars({ ...defaultProps, className: 'custom-class' }))

    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('renders 0% width bar when value is 0', async () => {
    render(await MoodLevelBars({ ...defaultProps, stressValue: 0 }))

    const bars = document.querySelectorAll('[style]')
    const widths = Array.from(bars).map((el) => (el as HTMLElement).style.width)

    expect(widths).toContain('0%')
  })

  it('renders 100% width bar when value is 5', async () => {
    render(await MoodLevelBars({ ...defaultProps, energyValue: 5 }))

    const bars = document.querySelectorAll('[style]')
    const widths = Array.from(bars).map((el) => (el as HTMLElement).style.width)

    expect(widths).toContain('100%')
  })

  it('uses common.General translation namespace', async () => {
    render(await MoodLevelBars(defaultProps))

    expect(getTranslations).toHaveBeenCalledWith('common.General')
  })
})
