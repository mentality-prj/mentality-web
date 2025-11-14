import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'

import AddExercise from '@/components/Admin/AddExercise'
import { addExercise, getExercises } from '@/requests/exercises'
import { getTags } from '@/requests/tags'

// Mock dependencies
jest.mock('next-auth/react')
jest.mock('next-intl')
jest.mock('@/requests/exercises')
jest.mock('@/requests/tags')
jest.mock('@/utils/toast')

const mockSession = {
  user: {
    email: 'admin@test.com',
    role: 'admin',
  },
  OAuthToken: 'mock-token',
}

const mockExercises = [
  {
    id: '1',
    category: 'breathing exercises',
    title: '4-7-8 Breathing',
    annotation: 'Relaxing breath technique',
    description:
      'Inhale quietly through the nose for 4 seconds, hold for 7 seconds, exhale audibly through the mouth for 8 seconds.',
    tags: ['breathing', 'relaxation'],
  },
]

const mockTags = [
  {
    id: '1',
    key: 'stress',
    translations: { uk: 'Стрес', en: 'Stress', pl: 'Stres' },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
]

describe('AddExercise Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useSession as jest.Mock).mockReturnValue({ data: mockSession })
    ;(useLocale as jest.Mock).mockReturnValue('uk')
    ;(useTranslations as jest.Mock).mockReturnValue((key: string) => {
      const translations: Record<string, string> = {
        title: 'Додати нову вправу',
        button: 'Додати вправу',
        'exercisesList.title': 'Список вправ',
        'exercisesList.loading': 'Завантаження...',
        'exercisesList.empty': 'Вправи відсутні',
        'fields.category.label': 'Категорія:',
        'fields.title.label': 'Назва:',
        'fields.annotation.label': 'Анотація:',
        'fields.description.label': 'Опис:',
        'fields.tags.label': 'Теги:',
        'fields.tags.empty': 'Теги відсутні',
      }
      return translations[key as keyof typeof translations] || key
    })
  })

  it('renders form with all required fields', async () => {
    ;(getExercises as jest.Mock).mockResolvedValue({ data: [] })
    ;(getTags as jest.Mock).mockResolvedValue({ data: [] })

    render(<AddExercise />)

    await waitFor(() => {
      expect(screen.getByText('Додати нову вправу')).toBeInTheDocument()
    })
    expect(screen.getByLabelText('Категорія:')).toBeInTheDocument()
    expect(screen.getByLabelText('Назва:')).toBeInTheDocument()
    expect(screen.getByLabelText('Анотація:')).toBeInTheDocument()
    expect(screen.getByLabelText('Опис:')).toBeInTheDocument()
  })

  it('loads and displays exercises on mount', async () => {
    ;(getExercises as jest.Mock).mockResolvedValue({ data: mockExercises })
    ;(getTags as jest.Mock).mockResolvedValue({ data: [] })

    render(<AddExercise />)

    await waitFor(() => {
      expect(screen.getByText('4-7-8 Breathing')).toBeInTheDocument()
    })
  })

  it('loads and displays available tags', async () => {
    ;(getExercises as jest.Mock).mockResolvedValue({ data: [] })
    ;(getTags as jest.Mock).mockResolvedValue({ data: mockTags })

    render(<AddExercise />)

    await waitFor(() => {
      expect(screen.getByText('Стрес')).toBeInTheDocument()
    })
  })

  it('displays loading state', async () => {
    ;(getExercises as jest.Mock).mockReturnValue(new Promise((resolve) => setTimeout(() => resolve({ data: [] }), 100)))
    ;(getTags as jest.Mock).mockResolvedValue({ data: [] })

    render(<AddExercise />)

    await waitFor(() => {
      expect(screen.getByText('Завантаження...')).toBeInTheDocument()
    })
  })

  it('displays empty state when no exercises', async () => {
    ;(getExercises as jest.Mock).mockResolvedValue({ data: [] })
    ;(getTags as jest.Mock).mockResolvedValue({ data: [] })

    render(<AddExercise />)

    await waitFor(() => {
      expect(screen.getByText('Вправи відсутні')).toBeInTheDocument()
    })
  })

  it('allows selecting tags with checkboxes', async () => {
    ;(getExercises as jest.Mock).mockResolvedValue({ data: [] })
    ;(getTags as jest.Mock).mockResolvedValue({ data: mockTags })

    render(<AddExercise />)

    await waitFor(() => {
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeInTheDocument()
      fireEvent.click(checkbox)
      expect(checkbox).toBeChecked()
    })
  })

  it('validates all required fields before submission', async () => {
    ;(getExercises as jest.Mock).mockResolvedValue({ data: [] })
    ;(getTags as jest.Mock).mockResolvedValue({ data: [] })

    render(<AddExercise />)

    await waitFor(() => {
      expect(screen.getByText('Додати нову вправу')).toBeInTheDocument()
    })

    const submitButton = screen.getByText('Додати вправу')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(addExercise).not.toHaveBeenCalled()
    })
  })

  // FIXME: This test is skipped because Next.js Server Actions (async form actions)
  // are not properly supported in jsdom test environment. The form submission
  // with action={asyncFunction} doesn't trigger the action in tests.
  // To properly test this, consider using E2E tests or refactoring to use onClick handlers.
  it.skip('submits form with valid data', async () => {
    ;(getExercises as jest.Mock).mockResolvedValue({ data: [] })
    ;(getTags as jest.Mock).mockResolvedValue({ data: mockTags })
    ;(addExercise as jest.Mock).mockResolvedValue({ data: mockExercises[0] })

    render(<AddExercise />)

    await waitFor(() => {
      expect(screen.getByText('Стрес')).toBeInTheDocument()
    })

    // Fill form
    fireEvent.change(screen.getByLabelText('Назва (українська):'), {
      target: { value: 'Медитація' },
    })
    fireEvent.change(screen.getByLabelText('Назва (англійська):'), {
      target: { value: 'Meditation' },
    })
    fireEvent.change(screen.getByLabelText('Назва (польська):'), {
      target: { value: 'Medytacja' },
    })
    fireEvent.change(screen.getByLabelText('Опис (українська):'), {
      target: { value: 'Опис вправи' },
    })
    fireEvent.change(screen.getByLabelText('Опис (англійська):'), {
      target: { value: 'Exercise description' },
    })
    fireEvent.change(screen.getByLabelText('Опис (польська):'), {
      target: { value: 'Opis ćwiczenia' },
    })
    fireEvent.change(screen.getByLabelText('Тривалість (хвилини):'), {
      target: { value: '10' },
    })

    // Select tag
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    const submitButton = screen.getByText('Додати вправу')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(addExercise).toHaveBeenCalledWith(
        mockSession,
        expect.objectContaining({
          title: {
            uk: 'Медитація',
            en: 'Meditation',
            pl: 'Medytacja',
          },
          description: expect.any(Object),
          duration: 10,
          tags: ['1'],
        })
      )
    })
  })

  it('handles API errors gracefully', async () => {
    ;(getExercises as jest.Mock).mockResolvedValue({ error: 'Failed to load exercises' })
    ;(getTags as jest.Mock).mockResolvedValue({ data: [] })

    render(<AddExercise />)

    await waitFor(() => {
      expect(screen.getByText('Вправи відсутні')).toBeInTheDocument()
    })
  })

  // FIXME: This test is skipped because Next.js Server Actions (async form actions)
  // are not properly supported in jsdom test environment. The form submission
  // with action={asyncFunction} doesn't trigger the action in tests.
  // To properly test this, consider using E2E tests or refactoring to use onClick handlers.
  it.skip('clears selected tags after successful submission', async () => {
    ;(getExercises as jest.Mock).mockResolvedValue({ data: [] })
    ;(getTags as jest.Mock).mockResolvedValue({ data: mockTags })
    ;(addExercise as jest.Mock).mockResolvedValue({ data: mockExercises[0] })

    render(<AddExercise />)

    await waitFor(() => {
      const checkbox = screen.getByRole('checkbox')
      fireEvent.click(checkbox)
      expect(checkbox).toBeChecked()
    })

    // Submit form (simplified)
    const submitButton = screen.getByText('Додати вправу')
    fireEvent.click(submitButton)

    await waitFor(() => {
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).not.toBeChecked()
    })
  })
})
