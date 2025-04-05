import { fireEvent, render, screen } from '@testing-library/react'

import Settings from '@/components/Profile/Settings'

const mockUser = {
  name: 'John Doe',
  email: 'john@example.com',
}

describe('profile settings', () => {
  it('renders form inputs with user data', () => {
    render(<Settings user={mockUser} />)

    expect(screen.getByDisplayValue('John')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument()
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument()
  })

  it('disables Save and Cancel buttons when no changes made', () => {
    render(<Settings user={mockUser} />)

    const saveButton = screen.getByRole('button', { name: /save/i })
    const cancelButton = screen.getByRole('button', { name: /cancel/i })

    expect(saveButton).toBeDisabled()
    expect(cancelButton).toBeDisabled()
  })

  it('enables buttons after form change', () => {
    render(<Settings user={mockUser} />)

    const nameInput = screen.getByLabelText('Name')
    fireEvent.change(nameInput, { target: { value: 'Johnny' } })

    expect(screen.getByRole('button', { name: /save/i })).toBeEnabled()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeEnabled()
  })

  it('shows validation error on submit with invalid name', () => {
    render(<Settings user={mockUser} />)

    const nameInput = screen.getByLabelText('Name')
    fireEvent.change(nameInput, { target: { value: 'Jo' } }) // меньше 3 символов

    fireEvent.click(screen.getByRole('button', { name: /save/i }))
    expect(screen.getByText(/must contain at least 3 characters/i)).toBeInTheDocument()
  })
})
