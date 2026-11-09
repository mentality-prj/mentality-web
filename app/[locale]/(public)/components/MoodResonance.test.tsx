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
        toJSON: () => ¶»§q«^