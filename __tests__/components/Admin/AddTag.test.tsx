import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'

import AddTag from '@/components/Admin/AddTag'
import { addTag, getTags } from '@/requests/tags'

// Mock dependencies
jest.mock('next-auth/react')
jest.mock('next-intl')
jest.mock('@/requests/tags')
jest.mock('@/utils/toast')

const mockSession = {
  user: {
    email: 'admin@test.com',
    role: 'admin',
  },
  OAuthToken: 'mock-token',
}

const mockTags = [
  {
    id: '1',
    key: 'stress',
    translations: { uk: 'Стрес', en: 'Stress', pl: 'Stres' },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    key: 'anxiety',
    translations: { uk: 'Тривога', en: 'Anxiety', pl: 'Lęk' },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
]

describe('AddTag Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useSession as jest.Mock).mockReturnValue({ data: mockSession })
    ;(useLocale as jest.Mock).mockReturnValue('uk')
    ;(useTranslations as jest.Mock).mockReturnValue((key: string) => {
      const translations: Record<string, string> = {
        title: 'Додати новий тег',
        button: 'Додати тег',
        'tagsList.title': 'Список тегів',
        'tagsList.loading': 'Завантаження...',
        'tagsList.empty': 'Теги відсутні',
        'fields.key.label': 'Додати ключ тегу:',
        'fields.key.description': 'Додай унікальний ключ',
        'fields.uk.label': 'Українська:',
        'fields.en.label': 'Англійська:',
        'fields.pl.label': 'Польська:',
      }
      return translations[key as keyof typeof translations] || key
    })
  })

  it('renders form with all language fields', async () => {
    ;(getTags as jest.Mock).mockResolvedValue({ data: [] })

    render(<AddTag />)

    await waitFor(() => {
      expect(screen.getByText('Додати новий тег')).toBeInTheDocument()
    })
    expect(screen.getByLabelText('Додати ключ тегу:')).toBeInTheDocument()
    expect(screen.getByLabelText('Українська:')).toBeInTheDocument()
    expect(screen.getByLabelText('Англійська:')).toBeInTheDocument()
    expect(screen.getByLabelText('Польська:')).toBeInTheDocument()
  })

  it('loads and displays tags on mount', async () => {
    ;(getTags as jest.Mock).mockResolvedValue({ data: mockTags })

    render(<AddTag />)

    await waitFor(() => {
      expect(screen.getByText('Стрес')).toBeInTheDocument()
      expect(screen.getByText('Тривога')).toBeInTheDocument()
    })
  })

  it('displays loading state', async () => {
    ;(getTags as jest.Mock).mockReturnValue(new Promise((resolve) => setTimeout(() => resolve({ data: [] }), 100)))

    render(<AddTag />)

    await waitFor(() => {
      expect(screen.getByText('Завантаження...')).toBeInTheDocument()
    })
  })

  it('displays empty state when no tags', async () => {
    ;(getTags as jest.Mock).mockResolvedValue({ data: [] })

    render(<AddTag />)

    await waitFor(() => {
      expect(screen.getByText('Теги відсутні')).toBeInTheDocument()
    })
  })

  it('validates empty fields before submission', async () => {
    ;(getTags as jest.Mock).mockResolvedValue({ data: [] })

    render(<AddTag />)

    await waitFor(() => {
      expect(screen.getByText('Додати новий тег')).toBeInTheDocument()
    })

    const submitButton = screen.getByText('Додати тег')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(addTag).not.toHaveBeenCalled()
    })
  })

  // FIXME: This test is skipped because Next.js Server Actions (async form actions)
  // are not properly supported in jsdom test environment. The form submission
  // with action={asyncFunction} doesn't trigger the action in tests.
  // To properly test this, consider using E2E tests or refactoring to use onClick handlers.
  it.skip('submits form with valid data', async () => {
    ;(getTags as jest.Mock).mockResolvedValue({ data: [] })
    ;(addTag as jest.Mock).mockResolvedValue({ data: mockTags[0] })

    render(<AddTag />)

    // Fill form
    fireEvent.change(screen.getByLabelText('Додати ключ тегу:'), {
      target: { value: 'stress' },
    })
    fireEvent.change(screen.getByLabelText('Українська:'), {
      target: { value: 'Стрес' },
    })
    fireEvent.change(screen.getByLabelText('Англійська:'), {
      target: { value: 'Stress' },
    })
    fireEvent.change(screen.getByLabelText('Польська:'), {
      target: { value: 'Stres' },
    })

    const submitButton = screen.getByText('Додати тег')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(addTag).toHaveBeenCalledWith(mockSession, {
        key: 'stress',
        translations: {
          uk: 'Стрес',
          en: 'Stress',
          pl: 'Stres',
        },
      })
    })
  })

  it('handles API errors gracefully', async () => {
    ;(getTags as jest.Mock).mockResolvedValue({ error: 'Failed to load tags' })

    render(<AddTag />)

    await waitFor(() => {
      expect(screen.getByText('Теги відсутні')).toBeInTheDocument()
    })
  })

  it('displays tags in current locale', async () => {
    ;(getTags as jest.Mock).mockResolvedValue({ data: mockTags })
    ;(useLocale as jest.Mock).mockReturnValue('en')

    render(<AddTag />)

    await waitFor(() => {
      expect(screen.getByText('Stress')).toBeInTheDocument()
      expect(screen.getByText('Anxiety')).toBeInTheDocument()
    })
  })
})
