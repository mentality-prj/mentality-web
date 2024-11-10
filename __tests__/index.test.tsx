import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'

import Home from '@/app/[local]/page'

describe('Home Page', () => {
  it('renders the Next.js logo', () => {
    render(
      <NextIntlClientProvider locale="en">
        <Home />
      </NextIntlClientProvider>
    )
    const logo = screen.getByAltText('Next.js logo')
    expect(logo).toBeInTheDocument()
  })

  it('displays the instruction text', () => {
    render(
      <NextIntlClientProvider locale="en">
        <Home />
      </NextIntlClientProvider>
    )
    const instruction = screen.getByText(/Get started by editing/i)
    expect(instruction).toBeInTheDocument()
  })

  it('renders the "Deploy now" button', () => {
    render(
      <NextIntlClientProvider locale="en">
        <Home />
      </NextIntlClientProvider>
    )
    const deployButton = screen.getByRole('link', { name: /Deploy now/i })
    expect(deployButton).toBeInTheDocument()
    expect(deployButton).toHaveAttribute('href', expect.stringContaining('vercel.com/new'))
  })

  it('renders the "Read our docs" button', () => {
    render(
      <NextIntlClientProvider locale="en">
        <Home />
      </NextIntlClientProvider>
    )
    const docsButton = screen.getByRole('link', { name: /Read our docs/i })
    expect(docsButton).toBeInTheDocument()
    expect(docsButton).toHaveAttribute('href', expect.stringContaining('nextjs.org/docs'))
  })

  it('renders the footer links', () => {
    render(
      <NextIntlClientProvider locale="en">
        <Home />
      </NextIntlClientProvider>
    )
    const learnLink = screen.getByRole('link', { name: /Learn/i })
    const examplesLink = screen.getByRole('link', { name: /Examples/i })
    const nextjsLink = screen.getByRole('link', { name: /Go to nextjs.org/i })

    expect(learnLink).toBeInTheDocument()
    expect(examplesLink).toBeInTheDocument()
    expect(nextjsLink).toBeInTheDocument()
  })
})
