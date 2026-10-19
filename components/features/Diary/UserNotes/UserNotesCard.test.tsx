import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useTranslations } from 'next-intl'

import { UserNotesCard } from '@/components/features/Diary/UserNotes/UserNotesCard'
import { useAuth } from '@/context/AuthProvider'
import { useRouter } from '@/i18n/navigation'
import { authService } from '@/lib/auth'
import { deleteDiary } from '@/requests/diary'
import { notifyError, notifySuccess } from '@/utils/toast'

jest.mock('next-intl', () => ({ useTranslations: jest.fn() }))
jest.mock('@/context/AuthProvider', () => ({ useAuth: jest.fn() }))
jest.mock('@/i18n/navigation', () => ({ useRouter: jest.fn() }))
jest.mock('@/lib/auth', () => ({ authService: { getUser: jest.fn() } }))
jest.mock('@/requests/diary', () => ({ activateDiary: jest.fn(), deleteDiary: jest.fn() }))
jest.mock('@/utils/toast', () => ({ notifyError: jest.fn(), notifySuccess: jest.fn() }))
jest.mock('@/ds/components/TooltipIcon', () => ({
  TooltipIcon: ({ label, onClick, children }: { label: string; onClick?: () => void; children: React.ReactNode }) => (
    <button type="button" aria-label={label} onClick={onClick}>
      {children}
    </button>
  ),
}))
jest.mock('@/components/shared/Cards/Card', () => ({
  __esModule: true,
  default: ({ text, tools }: { text: string; tools: React.ReactNode[] }) => (
    <article>
      <p>{text}</p>
      {tools}
    </article>
  ),
}))

describe('Diary deletion requires ownership and confirmation', () => {
  const refresh = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useTranslations as jest.Mock).mockReturnValue((key: string) => key)
    ;(useAuth as jest.Mock).mockReturnValue({ session: { user: { id: 'qa-one' } } })
    ;(useRouter as jest.Mock).mockReturnValue({ refresh })
  })

  afterEach(() => jest.restoreAllMocks())

  it('does not delete if the confirmation is canceled', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(false)
    render(<UserNotesCard id="507f1f77bcf86cd799439011" content="Private" availableTags={[]} />)

    fireEvent.click(screen.getByRole('button', { name: 'delete' }))
    expect(deleteDiary).not.toHaveBeenCalled()
    expect(refresh).not.toHaveBeenCalled()
  })

  it('deletes only the selected record after confirmation and refreshes history', async () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true)
    ;(deleteDiary as jest.Mock).mockResolvedValue({ data: true })
    render(<UserNotesCard id="507f1f77bcf86cd799439011" content="Private" availableTags={[]} />)

    fireEvent.click(screen.getByRole('button', { name: 'delete' }))
    await waitFor(() => expect(refresh).toHaveBeenCalledTimes(1))
    expect(deleteDiary).toHaveBeenCalledWith({ user: { id: 'qa-one' } }, '507f1f77bcf86cd799439011')
    expect(notifySuccess).toHaveBeenCalledWith('deleteSuccess')
  })

  it('keeps history if deletion fails', async () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true)
    ;(deleteDiary as jest.Mock).mockResolvedValue({ error: 'Unavailable' })
    render(<UserNotesCard id="507f1f77bcf86cd799439011" content="Private" availableTags={[]} />)

    fireEvent.click(screen.getByRole('button', { name: 'delete' }))
    await waitFor(() => expect(notifyError).toHaveBeenCalled())
    expect(refresh).not.toHaveBeenCalled()
    expect(screen.getByText('Private')).toBeInTheDocument()
  })

  it('recovers server-verified auth before showing native delete confirmation', async () => {
    ;(useAuth as jest.Mock).mockReturnValue({ session: null })
    ;(authService.getUser as jest.Mock).mockResolvedValue({ id: 'qa-one' })
    ;(deleteDiary as jest.Mock).mockResolvedValue({ data: true })
    const confirm = jest.spyOn(window, 'confirm').mockReturnValue(true)
    render(<UserNotesCard id="507f1f77bcf86cd799439011" content="Private" availableTags={[]} />)

    fireEvent.click(screen.getByRole('button', { name: 'delete' }))
    await waitFor(() => expect(deleteDiary).toHaveBeenCalledTimes(1))
    expect(authService.getUser).toHaveBeenCalledTimes(1)
    expect(confirm).toHaveBeenCalledTimes(1)
    expect(deleteDiary).toHaveBeenCalledWith(
      { user: { id: 'qa-one' } },
      '507f1f77bcf86cd799439011'
    )
  })

  it('never deletes an unauthenticated diary even after confirmation', async () => {
    ;(useAuth as jest.Mock).mockReturnValue({ session: null })
    ;(authService.getUser as jest.Mock).mockResolvedValue(null)
    const confirm = jest.spyOn(window, 'confirm').mockReturnValue(true)
    render(<UserNotesCard id="507f1f77bcf86cd799439011" content="Private" availableTags={[]} />)

    fireEvent.click(screen.getByRole('button', { name: 'delete' }))
    await waitFor(() => expect(notifyError).toHaveBeenCalledWith('notAuthenticated'))
    expect(confirm).toHaveBeenCalledTimes(1)
    expect(deleteDiary).not.toHaveBeenCalled()
  })

  it('does not delete recovered-auth diary when confirmation is canceled', async () => {
    ;(useAuth as jest.Mock).mockReturnValue({ session: null })
    ;(authService.getUser as jest.Mock).mockResolvedValue({ id: 'qa-one' })
    const confirm = jest.spyOn(window, 'confirm').mockReturnValue(false)
    render(<UserNotesCard id="507f1f77bcf86cd799439011" content="Private" availableTags={[]} />)

    fireEvent.click(screen.getByRole('button', { name: 'delete' }))
    await waitFor(() => expect(confirm).toHaveBeenCalledTimes(1))
    expect(authService.getUser).not.toHaveBeenCalled()
    expect(deleteDiary).not.toHaveBeenCalled()
  })
})
