import { render, screen } from '@testing-library/react'
import { getTranslations } from 'next-intl/server'

import DiaryPage from '@/app/[locale]/(protected)/diary/page'
import { getServerSession } from '@/lib/get-server-session'
import { getUserDiaries } from '@/requests/diary'

jest.mock('next-intl/server')
jest.mock('@/lib/get-server-session', () => ({ getServerSession: jest.fn() }))
jest.mock('@/requests/diary', () => ({ getUserDiaries: jest.fn() }))
jest.mock('@/components/features/Diary/AddNewNoteSection/AddNewNoteSection', () => ({
  __esModule: true,
  default: () => <div data-testid="diary-editor" />,
}))
jest.mock('@/components/features/Diary/DiaryExportButton', () => ({
  DiaryExportButton: ({ notes }: { notes: { id: string; isActive?: boolean }[] }) => (
    <div
      data-testid="diary-export"
      data-count={notes.length}
      data-archived={notes.filter((note) => note.isActive).length}
    />
  ),
}))
jest.mock('@/components/features/Diary/UserNotes/UserNotes', () => ({
  __esModule: true,
  default: () => <div data-testid="diary-history" />,
}))
jest.mock('@/components/features/Guide/QuickSupportCard', () => ({
  QuickSupportCard: () => <div data-testid="quick-support" />,
}))
jest.mock('@/components/features/Guide/SafetyResources', () => ({
  SafetyResources: ({ showDiaryPrivacy }: { showDiaryPrivacy?: boolean }) => (
    <div data-testid="safety-resources" data-diary-privacy={String(Boolean(showDiaryPrivacy))} />
  ),
}))
jest.mock('@/ds/components/PageTitle', () => ({
  PageTitle: ({ title }: { title: string }) => <h1>{title}</h1>,
}))
jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}))

beforeEach(() => {
  jest.clearAllMocks()
  ;(getTranslations as jest.Mock).mockResolvedValue((key: string) => key)
  ;(getServerSession as jest.Mock).mockResolvedValue({ user: { id: 'qa-user' } })
  ;(getUserDiaries as jest.Mock).mockResolvedValue({ data: [] })
})

describe('Diary daily support entry', () => {
  it('keeps optional support accessible while writing or viewing diary history', async () => {
    render(await DiaryPage())

    expect(screen.getByTestId('diary-editor')).toBeInTheDocument()
    expect(screen.getByTestId('quick-support')).toBeInTheDocument()
    expect(screen.getByTestId('safety-resources')).toHaveAttribute('data-diary-privacy', 'true')
    expect(screen.getByTestId('diary-history')).toBeInTheDocument()
  })

  it('passes archived and active entries to the complete export', async () => {
    ;(getUserDiaries as jest.Mock).mockResolvedValue({
      data: [
        { id: 'one', content: 'note', isActive: false },
        { id: 'two', content: 'archived', isActive: true },
      ],
    })
    render(await DiaryPage())

    expect(screen.getByTestId('diary-export')).toHaveAttribute('data-count', '2')
    expect(screen.getByTestId('diary-export')).toHaveAttribute('data-archived', '1')
  })

  it('keeps the immediate support action available when diary history is unavailable', async () => {
    ;(getUserDiaries as jest.Mock).mockResolvedValue({ error: 'Network failure' })
    render(await DiaryPage())

    expect(screen.getByRole('alert')).toHaveTextContent('components.Diary.historyLoadError')
    expect(screen.getByTestId('quick-support')).toBeInTheDocument()
    expect(screen.getByTestId('safety-resources')).toHaveAttribute('data-diary-privacy', 'true')
    expect(screen.queryByTestId('diary-history')).not.toBeInTheDocument()
    expect(screen.queryByTestId('diary-export')).not.toBeInTheDocument()
  })
})
