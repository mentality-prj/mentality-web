import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

describe('Home Page', () => {
  it('renders the Next.js logo', () => {
    render(<Home />)
    const logo = screen.getByAltText('Next.js logo')
    expect(logo).toBeInTheDocument()
  })

  it('displays the instruction text', () => {
    render(<Home />)
    const instruction = screen.getByText(/Get started by editing/i)
    expect(instruction).toBeInTheDocument()
  })

  it('renders the "Deploy now" button', () => {
    render(<Home />)
    const deployButton = screen.getByRole('link', { name: /Deploy now/i })
    expect(deployButton).toBeInTheDocument()
    expect(deployButton).toHaveAttribute('href', expect.stringContaining('vercel.com/new'))
  })

  it('renders the "Read our docs" button', () => {
    render(<Home />)
    const docsButton = screen.getByRole('link', { name: /Read our docs/i })
    expect(docsButton).toBeInTheDocument()
    expect(docsButton).toHaveAttribute('href', expect.stringContaining('nextjs.org/docs'))
  })

  it('renders the footer links', () => {
    render(<Home />)
    const learnLink = screen.getByRole('link', { name: /Learn/i })
    const examplesLink = screen.getByRole('link', { name: /Examples/i })
    const nextjsLink = screen.getByRole('link', { name: /Go to nextjs.org/i })

    expect(learnLink).toBeInTheDocument()
    expect(examplesLink).toBeInTheDocument()
    expect(nextjsLink).toBeInTheDocument()
  })
})
