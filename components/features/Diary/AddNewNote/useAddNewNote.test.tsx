import { act, renderHook } from '@testing-library/react'

import { useAuth } from '@/context/AuthProvider'
import useTags from '@/hooks/useTags'
import { createDiary } from '@/requests/diary'
import { notifyError, notifySuccess } from '@/utils/toast'

import { useAddNewNote } from './useAddNewNote'

jest.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }))
jest.mock('@/context/AuthProvider', () => ({ useAuth: jest.fn() }))
jest.mock('@/hooks/useTags', () => ({ __esModule: true, default: jest.fn() }))
jest.mock('@/requests/diary', () => ({ createDiary: jest.fn() }))
jest.mock('@/utils/toast', () => ({ notifyError: jest.fn(), notifySuccess: jest.fn() }))

beforeEach(() => {
  jest.clearAllMocks()
  ;(useAuth as jest.Mock).mockReturnValue({ session: { user: { id: 'reader-1' } } })
  ;(useTags as jest.Mock).mockReturnValue({
    selectedTags: ['private-tag'],
    localAvailableTags: [],
    tagLabels: {},
    showAddTag: false,
    setShowAddTag: jest.fn(),
    addTag: jest.fn(),
    removeTag: jest.fn(),
    onTagCreated: jest.fn(),
    clearSelectedTags: jest.fn(),
  })
})

describe('private diary draft preservation', () => {
  it('keeps the note and tags after a rejected save request and allows retry', async () => {
    ;(createDiary as jest.Mock)
      .mockRejectedValueOnce(new Error('Network connection lost'))
      .mockResolvedValueOnce({ data: { id: 'saved-note' } })
    const onSave = jest.fn()
    const { result } = renderHook(() => useAddNewNote({ onSave }))
    act(() => result.current.setNote('My private draft'))

    await act(async () => result.current.handleSubmit())
    expect(notifyError).toHaveBeenCalledWith('saveError')
    expect(notifySuccess).not.toHaveBeenCalled()
    expect(result.current.note).toBe('My private draft')
    expect(result.current.selectedTags).toEqual(['private-tag'])
    expect(result.current.isSubmitting).toBe(false)
    expect(onSave).not.toHaveBeenCalled()

    await act(async () => result.current.handleSubmit())
    expect(createDiary).toHaveBeenCalledTimes(2)
    expect(createDiary).toHaveBeenCalledWith(
      { user: { id: 'reader-1' } },
      { content: 'My private draft', tags: ['private-tag'], isActive: false }
    )
    expect(result.current.note).toBe('')
    expect(onSave).toHaveBeenCalledTimes(1)
  })

  it('preserves the draft when the API returns a handled error', async () => {
    ;(createDiary as jest.Mock).mockResolvedValue({ error: 'Service unavailable' })
    const { result } = renderHook(() => useAddNewNote({}))
    act(() => result.current.setNote('Keep this note'))

    await act(async () => result.current.handleSubmit())
    expect(result.current.note).toBe('Keep this note')
    expect(notifySuccess).not.toHaveBeenCalled()
    expect(result.current.isSubmitting).toBe(false)
  })

  it('does not tell the user to retry an already-saved diary entry after refresh callback fails', async () => {
    ;(createDiary as jest.Mock).mockResolvedValue({ data: { id: 'saved-note' } })
    const onSave = jest.fn().mockImplementation(() => {
      throw new Error('UI refresh failed')
    })
    const { result } = renderHook(() => useAddNewNote({ onSave }))
    act(() => result.current.setNote('Already saved'))

    await act(async () => result.current.handleSubmit())
    expect(createDiary).toHaveBeenCalledTimes(1)
    expect(notifySuccess).toHaveBeenCalledWith('saveSuccess')
    expect(notifyError).not.toHaveBeenCalled()
    expect(result.current.note).toBe('')
  })
})
