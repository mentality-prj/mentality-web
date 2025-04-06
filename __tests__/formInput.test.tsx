import { fireEvent, render, screen } from '@testing-library/react'

import { FormInput } from '@/components/ui/forms/FormInput'

describe('FormInput', () => {
  const defaultProps = {
    name: 'Email',
    value: '',
    onChangeValue: jest.fn(),
    error: undefined,
  }

  it('renders label and input correctly', () => {
    render(<FormInput {...defaultProps} />)

    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('calls onChangeValue on input change', () => {
    render(<FormInput {...defaultProps} />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'new@email.com' } })

    expect(defaultProps.onChangeValue).toHaveBeenCalledWith('new@email.com')
  })

  it('shows error message when error is provided', () => {
    render(<FormInput {...defaultProps} error="Invalid email" />)

    expect(screen.getByText('Invalid email')).toBeInTheDocument()
  })

  it('shows description if no error', () => {
    render(<FormInput {...defaultProps} description="Enter your email" />)

    expect(screen.getByText('Enter your email')).toBeInTheDocument()
  })

  it('does not show description if error is present', () => {
    render(<FormInput {...defaultProps} error="Required" description="Should be valid" />)

    expect(screen.queryByText('Should be valid')).not.toBeInTheDocument()
  })
})
