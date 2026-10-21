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
jest.mock('@/utils/timeZone', () => ({
  ...jest.requireActual('@/utils/timeZone'),
  getVerifiedBrowserTimeZone: jest.fn(),
}))
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
  ;(isSubmittedToday as jest.Mock).mockReturnValue(false)
  ;(getVerifiedBrowserTimeZone as jest.Mock).mockReturnValue('Europe/Warsaw')
})

describe('full daily mood admission uses one verified browser/SSR local day', () => {
  it('allows the form only after the server day and browser zone agree', () => {
    const { result } = renderHook(() => useAddNewMood({ timeZone: 'Europe/Warsaw', historyVerified: true }))
    act(() => result.current.setSelectedMood('good'))
    expect(result.current.timeZoneSynchronized).toBe(true)
    expect(result.current.isFormValid).toBe(true)
  })

  it('does not trust a stale travel cookie or allow a write from another zone', async () => {
    ;(getVerifiedBrowserTimeZone as jest.Mock).mockReturnValue('Europe/Kyiv')
    const { result } = renderHook(() =>
      useAddNewMood({ initialLastSubmittedAt: lastSubmittedAt, timeZone: 'Europe/Warsaw' })
    )
    act(() => result.current.setSelectedMood('good'))
    expect(result.current.timeZoneSynchronized).toBe(false)
    expect(result.current.isFormValid).toBe(false)
    expect(isSubmittedToday).not.toHaveBeenCalled()

    await act(async () => result.current.handleSubmit())
    expect(createMoodRecord).not.toHaveBeenCalled()
    expect(notifyError).toHaveBeenCalledWith('DailyLimit.SyncMessage')
  })

  it('blocks while a browser time-zone cookie is being initialized', async () => {
    const { result } = renderHook(() => useAddNewMood({ timeZone: null }))
    act(() => result.current.setSelectedMood('good'))
    expect(result.current.isFormValid).toBe(false)
    await act(async () => result.current.handleSubmit())
    expect(createMoodRecord).not.toHaveBeenCalled()
  })

  it('rechecks the device time zone at submit even before its focus event fires', async () => {
    const { result } = renderHook(() => useAddNewMood({ timeZone: 'Europe/Warsaw' }))
    act(() => result.current.setSelectedMood('good'))
    expect(result.current.isFormValid).toBe(true)
    ;(getVerifiedBrowserTimeZone as jest.Mock).mockReturnValue('Europe/Kyiv')
    await act(async () => result.current.handleSubmit())
    expect(createMoodRecord).not.toHaveBeenCalled()
    expect(result.current.timeZoneSynchronized).toBe(false)
  })

  it('refreshes after a confirmed 409 without retrying the write', async () => {
    ;(createMoodRecord as jest.Mock).mockResolvedValue({ error: 'Daily check-in exists', status: 409 })
    const onSave = jest.fn()
    const onClose = jest.fn()
    const { result } = renderHook(() => useAddNewMood({ timeZone: 'Europe/Warsaw', onSave, onClose }))
    act(() => result.current.setSelectedMood('good'))
    await act(async () => result.current.handleSubmit())
    expect(createMoodRecord).toHaveBeenCalledTimes(1)
    expect(onSave).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(notifyError).toHaveBeenCalledWith('DailyLimit.Message')
  })

  it('fails closed if the server daily-record lookup was unavailable', async () => {
    const { result } = renderHook(() => useAddNewMood({ timeZone: 'Europe/Warsaw', historyVerified: false }))
    act(() => result.current.setSelectedMood('good'))
    expect(result.current.isFormValid).toBe(false)
    await act(async () => result.current.handleSubmit())
    expect(createMoodRecord).not.toHaveBeenCalled()
  })
})
