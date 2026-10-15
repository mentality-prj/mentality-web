/** @jest-environment jsdom */
import { fireEvent, render, screen } from '@testing-library/react'

import { Slider } from './Slider'

describe('responsive mood slider', () => {
  it('supports horizontal orientation and keyboard adjustment', () => {
    const onChange = jest.fn()
    render(<Slider orientation="horizontal" min={1} max={5} value={3} onChange={onChange} />)

    const slider = screen.getByRole('slider')
    expect(slider).toHaveAttribute('aria-orientation', 'horizontal')
    fireEvent.keyDown(slider, { key: 'ArrowRight' })
    expect(onChange).toHaveBeenCalledWith(4)
  })

  it('blocks disabled vertical slider input', () => {
    const onChange = jest.fn()
    render(<Slider orientation="vertical" disabled onChange={onChange} />)

    const slider = screen.getByRole('slider')
    expect(slider).toHaveAttribute('aria-orientation', 'vertical')
    fireEvent.keyDown(slider, { key: 'ArrowUp' })
    expect(onChange).not.toHaveBeenCalled()
  })
})
