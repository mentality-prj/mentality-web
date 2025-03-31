import { fireEvent, render } from '@testing-library/react'

import { FormInput } from '@/components/ui/forms/FormInput'

describe('FormInput', () => {
  const defaultProps = {
    name: 'Email',
    value: '',
    onChangeValue: jest.fn(),
    error: undefined,
  }

  it('renders label and input correctly', () => {
    const { getByLabelText, getByRole } = render(<FormInput {...defaultProps} />)

    expect(getByLabelText('Email')).toBeInTheDocument()
    expect(getByRole('textbox')).toBeInTheDocument()
  })

  it('calls onChangeValue on input change', () => {
    const { getByRole } = render(<FormInput {...defaultProps} />)

    const input = getByRole('textbox')
    fireEvent.change(input, { target: { value: 'new@email.com' } })

    expect(defaultProps.onChangeValue).toHaveBeenCalledWith('new@email.com')
  })

  it('shows error message when error is provided', () => {
    const { getByText } = render(<FormInput {...defaultProps} error="Invalid email" />)

    expect(getByText('Invalid email')).toBeInTheDocument()
  })

  it('shows description if no error', () => {
    const { getByText } = render(<FormInput {...defaultProps} description="Enter your email" />)

    expect(getByText('Enter your email')).toBeInTheDocument()
  })

  it('does not show description if error is present', () => {
    const { queryByText } = render(<FormInput {...defaultProps} error="Required" description="Should be valid" />)

    expect(queryByText('Should be valid')).not.toBeInTheDocument()
  })
})
