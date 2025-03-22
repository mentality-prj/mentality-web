import { render, screen } from '@testing-library/react'

import Home from '@/app/[locale]/page'

describe('Home Page', () => {
  it('displays the "Available Balance" block', () => {
    render(<Home />)
    const text = screen.getByText(/Available Balance/i)
    expect(text).toBeInTheDocument()
  })

  it('displays the "Section" block', () => {
    render(<Home />)
    const text = screen.getByText(/Section/i)
    expect(text).toBeInTheDocument()
  })
})
