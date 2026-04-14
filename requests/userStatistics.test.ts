import { USER_STATISTICS_ENDPOINTS } from '@/constants/endpoints'
import { performAuthRequest } from '@/requests/genericFetch'
import { getMoodStatistics, getPsyTestsStatistics } from '@/requests/userStatistics'
import { CustomSession } from '@/types/auth'
import { MoodStatistics, PsyTestsStatistics } from '@/types/userStatistics'

jest.mock('@/requests/genericFetch')

const mockSession: CustomSession = {
  user: { id: 'user-1', name: 'Test User', email: 'user@test.com', role: 'user' as const },
  OAuthToken: 'mock-token',
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
}

const mockMoodStats: MoodStatistics = {
  totalRecords: 42,
  currentStreak: 7,
  longestStreak: 14,
  allTime: { mood: 3.4, stress: 2.1, energy: 3.7, focus: 3.2 },
  last7d: { mood: 3.6, stress: 1.9, energy: 3.8, focus: 3.4 },
  last30d: null,
  trend30d: [{ date: '2026-03-08', mood: 3.2, stress: 2.4, energy: 3.5, focus: 3.1 }],
  topTags: [{ tag: 'work', count: 12 }],
  weekdayAverages: [{ weekday: 1, mood: 3.2, count: 5 }],
}

const mockPsyTestsStats: PsyTestsStatistics = {
  k10: {
    totalTaken: 5,
    latest: { score: 28, level: 'Moderate distress', date: '2026-04-01T12:00:00.000Z' },
    trend: [{ date: '2026-04-01T12:00:00.000Z', score: 28, level: 'Moderate distress' }],
  },
  phq9: {
    totalTaken: 0,
    latest: null,
    trend: [],
  },
  gad7: {
    totalTaken: 2,
    latest: { score: 6, level: 'Mild anxiety', date: '2026-04-02T08:00:00.000Z' },
    trend: [{ date: '2026-04-02T08:00:00.000Z', score: 6, level: 'Mild anxiety' }],
  },
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getMoodStatistics', () => {
  it('returns data on success', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: mockMoodStats })

    const result = await getMoodStatistics(mockSession)

    expect(result).toEqual({ data: mockMoodStats })
    expect(performAuthRequest).toHaveBeenCalledWith(
      mockSession,
      expect.stringContaining(USER_STATISTICS_ENDPOINTS.MOOD),
      expect.objectContaining({ method: 'GET' })
    )
  })

  it('returns error and status on failure', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Server error', status: 500 })

    const result = await getMoodStatistics(mockSession)

    expect(result).toEqual({ error: 'Server error', status: 500 })
  })

  it('returns error without status when status is absent', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Not found' })

    const result = await getMoodStatistics(mockSession)

    expect(result).toEqual({ error: 'Not found' })
    expect('status' in result).toBe(false)
  })

  it('returns error when server returns null data', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: null })

    const result = await getMoodStatistics(mockSession)

    expect(result).toEqual({ error: 'No mood statistics returned' })
  })

  it('works with null session', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: mockMoodStats })

    const result = await getMoodStatistics(null)

    expect(result).toEqual({ data: mockMoodStats })
    expect(performAuthRequest).toHaveBeenCalledWith(null, expect.any(String), expect.any(Object))
  })
})

describe('getPsyTestsStatistics', () => {
  it('returns data on success', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: mockPsyTestsStats })

    const result = await getPsyTestsStatistics(mockSession)

    expect(result).toEqual({ data: mockPsyTestsStats })
    expect(performAuthRequest).toHaveBeenCalledWith(
      mockSession,
      expect.stringContaining(USER_STATISTICS_ENDPOINTS.PSYTESTS),
      expect.objectContaining({ method: 'GET' })
    )
  })

  it('returns error and status on failure', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Unauthorized', status: 401 })

    const result = await getPsyTestsStatistics(mockSession)

    expect(result).toEqual({ error: 'Unauthorized', status: 401 })
  })

  it('returns error without status when status is absent', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Timeout' })

    const result = await getPsyTestsStatistics(mockSession)

    expect(result).toEqual({ error: 'Timeout' })
    expect('status' in result).toBe(false)
  })

  it('returns error when server returns null data', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: null })

    const result = await getPsyTestsStatistics(mockSession)

    expect(result).toEqual({ error: 'No psytests statistics returned' })
  })

  it('works with null session', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: mockPsyTestsStats })

    const result = await getPsyTestsStatistics(null)

    expect(result).toEqual({ data: mockPsyTestsStats })
    expect(performAuthRequest).toHaveBeenCalledWith(null, expect.any(String), expect.any(Object))
  })
})
