import { render } from '@testing-library/react'

import { hexToRgb, mixRgb } from './waterRenderer'
import { WaterSurface } from './WaterSurface'

describe('WaterSurface', () => {
  it('falls back to a CSS gradient when WebGL is unavailable', () => {
    const { container } = render(<WaterSurface colors={{ deep: '#7cc3d2', mid: '#dcf2f5', light: '#ffffff' }} />)
    const host = container.firstElementChild as HTMLElement
    expect(host).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelector('canvas')).toHaveStyle({ display: 'none' })
  })

  it('converts and blends palette colours', () => {
    expect(hexToRgb('#ff8000')).toEqual([1, 128 / 255, 0])
    expect(mixRgb([0, 0, 0], [1, 1, 1], 0.5)).toEqual([0.5, 0.5, 0.5])
  })
})
