import { render, screen } from '@testing-library/react'

import Home from '@/app/[locale]/page'

describe('Home Page', () => {
  it('displays Home Page', () => {
    render(<Home />)
    const text = screen.getByText(/HomePage/i)
    expect(text).toBeInTheDocument()
  })
})
