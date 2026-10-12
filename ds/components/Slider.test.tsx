/** @jest-environment jsdom */
import { fireEvent, render, screen } from '@testing-library/react'

import { Slider } from './Slider'

describe('mood slider responsive orientation', () => {
  it('renders a horizontal scale with bounded marks and keyboard controls', () => {
    const onChange = jest.fn()
    render(
      <Slider
        aria-label="Energy level"
        min={1}
        max={5}
        step={1}
        value={3}
        orientation="horizontal"
        marks={[{ value: 1, label: 'Low' }, { value: 5, label: 'High' }]}
        onChange={onChange}
      />
    )

    const slider = screen.getByRole('slider', { name: 'Energy level' })
    expect(slider).toHaveAttribute('aria-orientation', 'horizontal')
    expect(slider).toHaveAttribute('aria-valuenow', '3')
    expect(screen.getByText('Low').parentElement).toHaveClass('translate-x-0')
    expect(screen.getByText('High').parentElement).toHaveClass('-translate-x-full')
    fireEvent.keyDown(slider, { key: 'ArrowRight' })
    expect(onChange).toHaveBeenCalledWith(4)
  })

  it('retains vertical scale semantics and disabled protection', () => {
    const onChange = jest.fn()
    render(
      <Slider aria-label="Stress level" min={1} max={5} value={2} orientation="vertical" disabled onChange={onChange} />
    )
    const slider = screen.getByRole('slider', { name: 'Stress level' })
    expect(slider).toHaveAttribute('aria-orientation', 'vertical')
    expect(slider).toHaveAttribute('aria-disabled', 'true')
    fireEvent.keyDown(slider, { key: 'ArrowUp' })
    expect(onChange).not.toHaveBeenCalled()
  })
})
