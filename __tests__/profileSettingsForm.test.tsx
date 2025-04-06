import { fireEvent, screen } from '@testing-library/react'

import ProfileSettingsForm from '@/components/Profile/ProfileSettingsForm'
import { renderWithIntl } from '@/utils/renderWithIntl'

const mockUser = {
  name: 'John Doe',
  email: 'john@example.com',
}

describe('ProfileSettingsForm', () => {
  it('renders form inputs with user data', () => {
    renderWithIntl(<ProfileSettingsForm user={mockUser} />)

    expect(screen.getByTestId('input-firstName')).toHaveValue('John')
    expect(screen.getByTestId('input-lastName')).toHaveValue('Doe')
    expect(screen.getByTestId('input-email')).toHaveValue('john@example.com')
  })

  it('disables Save and Cancel buttons when no changes made', () => {
    renderWithIntl(<ProfileSettingsForm user={mockUser} />)

    const saveButton = screen.getByTestId('btn-save')
    const cancelButton = screen.getByTestId('btn-cancel')

    expect(saveButton).toBeDisabled()
    expect(cancelButton).toBeDisabled()
  })

  it('enables buttons after form change', () => {
    renderWithIntl(<ProfileSettingsForm user={mockUser} />)

    const nameInput = screen.getByTestId('input-firstName')
    fireEvent.change(nameInput, { target: { value: 'Johnny' } })

    expect(screen.getByTestId('btn-save')).toBeEnabled()
    expect(screen.getByTestId('btn-cancel')).toBeEnabled()
  })

  it('shows validation error on submit with invalid name', () => {
    renderWithIntl(<ProfileSettingsForm user={mockUser} />)

    const nameInput = screen.getByTestId('input-firstName')
    fireEvent.change(nameInput, { target: { value: 'Jo' } })

    fireEvent.click(screen.getByTestId('btn-save'))

    expect(screen.getByTestId('error-name')).toBeInTheDocument()
  })
})
