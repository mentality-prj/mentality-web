import { render, screen } from '@testing-library/react'

import { getUserDiaries } from '@/requests/diary'

import DiaryPage from './page'

jest.mock('next-intl/server', () => ({ getTranslations: jest.fn().mockResolvedValue((key: string) => key) }))
jest.mock('@/lib/get-server-session', () => ({ getServerSession: jest.fn().mockResolvedValue({ user: { id: 'diary-owner' } }) }))
jest.mock('@/requests/diary', () => ({ getUserDiaries: jest.fn() }))
jest.mock('@/components/features/Diary/AddNewNoteSection/AddNewNoteSection', () => ({
  __esModule: true,
  default: () => <div>editable-diary-composer</div>,
}))
jest.mock('@/components/features/Diary/UserNotes/UserNotes', () => ({
  __esModule: true,
  default: ({ notes }: { notes: { id: string }[] }) => <p>saved-entries:{notes.length}</p>,
}))
jest.mock('@/components/features/Diary/DiaryHistoryError', () => ({
  DiaryHistoryError: () => <p role="alert">history-load-failed</p>,
}))
jest.mock('@/ds/components/PageTitle', () => ({ PageTitle: () => <h1>Diary</h1> }))

beforeEach(() => jest.clearAllMocks())

describe('owner diary history read states', () => {
  it('shows the retryable error instead of claiming a failed history read is empty', async () => {
    ;(getUserDiaries as jest.Mock).mockResolvedValue({ error: 'Network unavailable' })
    render(await DiaryPage())

    expect(screen.getByRole('alert')).toHaveTextContent('history-load-failed')
    expect(screen.queryByText(/saved-entries:/)).not.toBeInTheDocument()
    expect(screen.getByText('editable-diary-composer')).toBeInTheDocument()
  })

  it('shows confirmed saved diary records when the read succeeds', async () => {
    ;(getUserDiaries as jest.Mock).mockResolvedValue({ data: [{ id: 'private-entry-1' }] })
    render(await DiaryPage())

    expect(screen.getByText('saved-entries:1')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
