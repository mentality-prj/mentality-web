import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useTranslations } from 'next-intl'

import { UserNotesCard } from '@/components/features/Diary/UserNotes/UserNotesCard'
import { useAuth } from '@/context/AuthProvider'
import { useRouter } from '@/i18n/navigation'
import { deleteDiary } from '@/requests/diary'
import { notifyError, notifySuccess } from '@/utils/toast'

jest.mock('next-intl', () => ({ useTranslations: jest.fn() }))
jest.mock('@/context/AuthProvider', () => ({ useAuth: jest.fn() }))
jest.mock('@/i18n/navigation', () => ({ useRouter: jest.fn() }))
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
})
