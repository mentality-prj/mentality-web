import { act, renderHook } from '@testing-library/react'
import { useTranslations } from 'next-intl'

import { useAuth } from '@/context/AuthProvider'
import { isSubmittedToday } from '@/helpers/mood.helpers'
import useTags from '@/hooks/useTags'
import { createMoodRecord } from '@/requests/moodRecord'
import { getVerifiedBrowserTimeZone } from '@/utils/timeZone'
import { notifyError } from '@/utils/toast'

import { useAddNewMood } from './useAddNewMood'

jest.mock('next-intl', () => ({ useTranslations: jest.fn() }))
jest.mock('@/context/AuthProvider', () => ({ useAuth: jest.fn() }))
jest.mock('@/helpers/mood.helpers', () => ({ isSubmittedToday: jest.fn() }))
jest.mock('@/hooks/useTags', () => ({ __esModule: true, default: jest.fn() }))
jest.mock('@/utils/timeZone', () => ({ getVerifiedBrowserTimeZone: jest.fn() }))
jest.mock('@/requests/moodRecord', () => ({ createMoodRecord: jest.fn() }))
jest.mock('@/utils/toast', () => ({ notifyError: jest.fn(), notifySuccess: jest.fn() }))

const lastSubmittedAt = '2026-10-17T22:10:00.000Z'

beforeEach(() => {
  jest.clearAllMocks()
  ;(useTranslations as jest.Mock).mockReturnValue((key: string) => key)
  ;(useAuth as jest.Mock).mockReturnValue({ session: { user: { id: 'qa-user' } } })
  ;(useTags as jest.Mock).mockReturnValue({
    selectedTags: [],
    localAvailableTags: [],
    tagLabels: {},
    showAddTag: false,
    setShowAddTag: jest.fn(),
    addTag: jest.fn(),
    removeTag: jest.fn(),
    onTagCreated: jest.fn(),
    clearSelectedTags: jest.fn(),
  })
  ;(isSubmittedToday as jest.Mock).mockReturnValue(true)
})

describe('mood form local day at hydration', () => {
  it('uses the browser IANA zone when the server cookie is missing', () => {
    ;(getVerifiedBrowserTimeZone as jest.Mock).mockReturnValue('Europe/Warsaw')

    const { result } = renderHook(() => useAddNewMood({ initialLastSubmittedAt: lastSubmittedAt, timeZone: null }))

    expect(isSubmittedToday).toHaveBeenLastCalledWith(lastSubmittedAt, 'Europe/Warsaw')
    expect(result.current.submittedToday).toBe(true)
  })

  it('prefers the current browser IANA zone to a stale travel cookie', () => {
    ;(getVerifiedBrowserTimeZone as jest.Mock).mockReturnValue('Europe/Kyiv')

    renderHook(() => useAddNewMood({ initialLastSubmittedAt: lastSubmittedAt, timeZone: 'Europe/Warsaw' }))

    expect(isSubmittedToday).toHaveBeenLastCalledWith(lastSubmittedAt, 'Europe/Kyiv')
  })

  it('handles a concurrent 409 without retrying the daily check-in', async () => {
    ;(getVerifiedBrowserTimeZone as jest.Mock).mockReturnValue('Europe/Warsaw')
    ;(isSubmittedToday as jest.Mock).mockReturnValue(false)
    ;(createMoodRecord as jest.Mock).mockResolvedValue({ error: 'Daily check-in exists', status: 409 })
    const onSave = jest.fn()
    const onClose = jest.fn()
    const { result } = renderHook(() => useAddNewMood({ onSave, onClose }))
    act(() => result.current.setSelectedMood('good'))

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(createMoodRecord).toHaveBeenCalledTimes(1)
    expect(onSave).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(notifyError).toHaveBeenCalledWith('Toast.AlreadySaved')
  })

  it('blocks form validation when the last-record lookup failed', () => {
    ;(getVerifiedBrowserTimeZone as jest.Mock).mockReturnValue('Europe/Warsaw')
    const { result } = renderHook(() => useAddNewMood({ timeZone: 'Europe/Warsaw', historyVerified: false }))
    act(() => result.current.setSelectedMood('good'))
    expect(result.current.isFormValid).toBe(false)
  })

  it('never enables a local-day submission without a verified zone', () => {
    ;(getVerifiedBrowserTimeZone as jest.Mock).mockReturnValue(null)
    const { result } = renderHook(() => useAddNewMood({ timeZone: null }))

    expect(result.current.isFormValid).toBe(false)
  })
})
