import { act, renderHook } from '@testing-library/react'
import { useTranslations } from 'next-intl'

import { useAuth } from '@/context/AuthProvider'
import useTags from '@/hooks/useTags'
import { authService } from '@/lib/auth'
import { createDiary } from '@/requests/diary'
import { notifyError, notifySuccess } from '@/utils/toast'

import useAddNewNote from './useAddNewNote'

jest.mock('next-intl', () => ({ useTranslations: jest.fn() }))
jest.mock('@/context/AuthProvider', () => ({ useAuth: jest.fn() }))
jest.mock('@/lib/auth', () => ({ authService: { getUser: jest.fn() } }))
jest.mock('@/requests/diary', () => ({ createDiary: jest.fn() }))
jest.mock('@/hooks/useTags', () => ({ __esModule: true, default: jest.fn() }))
jest.mock('@/utils/toast', () => ({ notifyError: jest.fn(), notifySuccess: jest.fn() }))
jest.mock('@/lib/logger', () => ({ logger: { warn: jest.fn(), error: jest.fn() } }))

const verifiedUser = { id: 'qa-1', name: 'QA', email: 'qa@example.test' }
const clearSelectedTags = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
  ;(useTranslations as jest.Mock).mockReturnValue((key: string) => key)
  ;(useAuth as jest.Mock).mockReturnValue({ session: null })
  ;(authService.getUser as jest.Mock).mockResolvedValue(verifiedUser)
  ;(createDiary as jest.Mock).mockResolvedValue({ data: { id: 'saved-entry' } })
  ;(useTags as jest.Mock).mockReturnValue({
    selectedTags: [],
    localAvailableTags: [],
    tagLabels: {},
    showAddTag: false,
    setShowAddTag: jest.fn(),
    addTag: jest.fn(),
    removeTag: jest.fn(),
    onTagCreated: jest.fn(),
    clearSelectedTags,
  })
})

describe('diary submission after real Zitadel redirect', () => {
  it('uses verified BFF identity when the client session is not hydrated', async () => {
    const onSave = jest.fn()
    const { result } = renderHook(() => useAddNewNote({ onSave }))

    act(() => result.current.setNote('Private test note'))
    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(authService.getUser).toHaveBeenCalledTimes(1)
    expect(createDiary).toHaveBeenCalledWith(
      { user: verifiedUser },
      { content: 'Private test note', tags: [], isActive: false }
    )
    expect(notifySuccess).toHaveBeenCalledWith('saveSuccess')
    expect(result.current.note).toBe('')
    expect(clearSelectedTags).toHaveBeenCalled()
    expect(onSave).toHaveBeenCalledTimes(1)
  })

  it('does not send a diary write if the BFF rejects identity', async () => {
    ;(authService.getUser as jest.Mock).mockResolvedValue(null)
    const { result } = renderHook(() => useAddNewNote({}))

    act(() => result.current.setNote('Draft'))
    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(createDiary).not.toHaveBeenCalled()
    expect(notifyError).toHaveBeenCalledWith('notAuthenticated')
    expect(result.current.note).toBe('Draft')
  })

  it('reuses an already hydrated session without another user lookup', async () => {
    const existing = { user: verifiedUser }
    ;(useAuth as jest.Mock).mockReturnValue({ session: existing })
    const { result } = renderHook(() => useAddNewNote({}))

    act(() => result.current.setNote('Draft'))
    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(authService.getUser).not.toHaveBeenCalled()
    expect(createDiary).toHaveBeenCalledWith(existing, expect.objectContaining({ content: 'Draft' }))
  })

  it('preserves the draft and reports failure if the request fails', async () => {
    ;(createDiary as jest.Mock).mockResolvedValue({ error: 'Backend unavailable' })
    const { result } = renderHook(() => useAddNewNote({}))

    act(() => result.current.setNote('Draft I do not want to lose'))
    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(result.current.note).toBe('Draft I do not want to lose')
    expect(notifyError).toHaveBeenCalled()
    expect(notifySuccess).not.toHaveBeenCalled()
  })
})
