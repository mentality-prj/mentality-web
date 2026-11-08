import { render } from '@testing-library/react'
import { readFileSync } from 'node:fs'

import { hexToRgb, mixRgb, WaterRenderer } from './waterRenderer'
import { WaterSurface } from './WaterSurface'

describe('WaterSurface', () => {
  it('renders the transparent overlay as premultiplied highlights without dark troughs', () => {
    const renderer = readFileSync('app/[locale]/(public)/components/water/waterRenderer.ts', 'utf8')
    expect(renderer).toContain('premultipliedAlpha: overlay')
    expect(renderer).toContain('gl_FragColor = vec4(vec3(crest), crest)')
    expect(renderer).not.toContain('uDeep * 0.6')
    expect(renderer).not.toContain('float trough =')
  })


  it('falls back to a CSS gradient when WebGL is unavailable', () => {
    const { container } = render(<WaterSurface colors={{ deep: '#7cc3d2', mid: '#dcf2f5', light: '#ffffff' }} />)
    const host = container.firstElementChild as HTMLElement
    expect(host).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelector('canvas')).toHaveStyle({ display: 'none' })
  })

  it('progresses water time at half speed without reducing the frame rate', () => {
    const start = performance.now() - 3000
    const regular = Object.assign(Object.create(WaterRenderer.prototype), { start, timeScale: 1 }) as WaterRenderer
    const slower = Object.assign(Object.create(WaterRenderer.prototype), { start, timeScale: 0.5 }) as WaterRenderer

    expect(slower.time).toBeCloseTo(regular.time * 0.5, 1)
  })

  it('converts and blends palette colours', () => {
    expect(hexToRgb('#ff8000')).toEqual([1, 128 / 255, 0])
    expect(mixRgb([0, 0, 0], [1, 1, 1], 0.5)).toEqual([0.5, 0.5, 0.5])
  })
})
