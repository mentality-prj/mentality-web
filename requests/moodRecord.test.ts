import { MOOD_RECORD_ENDPOINTS } from '@/constants/endpoints'
import { logger } from '@/lib/logger'
import { parseMoodQuery } from '@/lib/moodQueryParser'
import { performAuthRequest } from '@/requests/genericFetch'
import { createMoodRecord, getLastMoodRecords, getMoodRecordById, getMoodRecords } from '@/requests/moodRecord'
import { CreateMoodRecordDto, MoodRecordEntity } from '@/types/api-responses'
import { CustomSession } from '@/types/auth'

jest.mock('@/requests/genericFetch')
jest.mock('@/lib/logger', () => ({
  __esModule: true,
  logger: {
    warn: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}))

const mockSession: CustomSession = {
  user: { id: 'user-1', name: 'Test User', email: 'user@test.com', role: 'user' as const },
  OAuthToken: 'mock-token',
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
}

const mockRecord: MoodRecordEntity = {
  id: 'record-1',
  moodLevel: 4,
  stressLevel: 2,
  energyLevel: 3,
  focusLevel: 3,
  tags: ['calm'],
  createdAt: '2026-01-01T10:00:00.000Z',
}

const mockDto: CreateMoodRecordDto = {
  moodLevel: 4,
  stressLevel: 2,
  energyLevel: 3,
  focusLevel: 3,
  tags: ['calm'],
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('createMoodRecord', () => {
  it('returns data on success', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: mockRecord })

    const result = await createMoodRecord(mockSession, mockDto)

    expect(result).toEqual({ data: mockRecord })
    expect(performAuthRequest).toHaveBeenCalledWith(
      mockSession,
      expect.stringContaining(MOOD_RECORD_ENDPOINTS.BASE),
      expect.objectContaining({ method: 'POST', body: mockDto })
    )
  })

  it('returns error and logs on failure', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Server error' })

    const result = await createMoodRecord(mockSession, mockDto)

    expect(result).toEqual({ error: 'Server error' })
    expect(logger.error).toHaveBeenCalledWith('Failed to create mood record', { error: 'Server error' })
  })

  it('works with null session', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: mockRecord })

    const result = await createMoodRecord(null, mockDto)

    expect(result).toEqual({ data: mockRecord })
    expect(performAuthRequest).toHaveBeenCalledWith(null, expect.any(String), expect.any(Object))
  })
})

describe('getMoodRecords', () => {
  it('returns data without params', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: [mockRecord] })

    const result = await getMoodRecords(mockSession)

    expect(result).toEqual({
      data: {
        moodNotes: [mockRecord],
        total: 1,
      },
    })
    expect(performAuthRequest).toHaveBeenCalledWith(
      mockSession,
      expect.not.stringContaining('?'),
      expect.objectContaining({ method: 'GET' })
    )
  })

  it('appends page param to url', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: [mockRecord] })

    await getMoodRecords(mockSession, { page: 2 })

    expect(performAuthRequest).toHaveBeenCalledWith(mockSession, expect.stringContaining('page=2'), expect.any(Object))
  })

  it('appends limit param to url', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: [mockRecord] })

    await getMoodRecords(mockSession, { limit: 10 })

    expect(performAuthRequest).toHaveBeenCalledWith(
      mockSession,
      expect.stringContaining('limit=10'),
      expect.any(Object)
    )
  })

  it('appends both page and limit params', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: [mockRecord] })

    await getMoodRecords(mockSession, { page: 3, limit: 5 })

    const calledUrl: string = (performAuthRequest as jest.Mock).mock.calls[0][1]
    expect(calledUrl).toContain('page=3')
    expect(calledUrl).toContain('limit=5')
  })

  it('returns error on failure', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Unauthorized' })

    const result = await getMoodRecords(mockSession)

    expect(result).toEqual({ error: 'Unauthorized' })
  })

  describe('query params', () => {
    it('includes repeated tags and weekdays correctly in URL', async () => {
      ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: [mockRecord] })

      const searchParams = {
        tags: ['a', 'a', 'b', ''],
        weekdays: ['mon', 'xyz', 'tue', ''],
        energyLevel: 'veryHigh',
        focusLevel: 'veryHigh',
        moodLevel: 'great',
      }

      const query = parseMoodQuery(searchParams)

      await getMoodRecords(mockSession, query)

      const calledUrl: string = (performAuthRequest as jest.Mock).mock.calls[0][1]

      const urlParams = new URL(calledUrl).searchParams

      const tags = urlParams.getAll('tags')
      expect(tags).toEqual(['a', 'b'])

      const weekdays = urlParams.getAll('weekdays')
      expect(weekdays).toEqual(['1', '2'])

      expect(urlParams.get('moodMin')).toBe('5')
      expect(urlParams.get('moodMax')).toBe('5')

      expect(urlParams.get('energyMin')).toBe('5')
      expect(urlParams.get('energyMax')).toBe('5')

      expect(urlParams.get('focusMin')).toBe('5')
      expect(urlParams.get('focusMax')).toBe('5')
    })
  })

  describe('pagination total', () => {
    it('returns total from X-Total-Count header', async () => {
      ;(performAuthRequest as jest.Mock).mockResolvedValue({
        data: [mockRecord],
        headers: new Headers({
          'X-Total-Count': '100',
        }),
      })

      const result = await getMoodRecords(mockSession)

      expect(result).toMatchObject({
        data: {
          moodNotes: [mockRecord],
          total: 100,
        },
      })
    })

    it('fals back to moodNotes length when header is missing', async () => {
      ;(performAuthRequest as jest.Mock).mockResolvedValue({
        data: [mockRecord],
        headers: new Headers(),
      })

      const result = await getMoodRecords(mockSession)

      expect(result).toMatchObject({
        data: {
          moodNotes: [mockRecord],
          total: 1,
        },
      })
    })
  })
})

describe('getLastMoodRecords', () => {
  it('returns data without params', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: [mockRecord] })

    const result = await getLastMoodRecords(mockSession)

    expect(result).toEqual({ data: [mockRecord] })
    expect(performAuthRequest).toHaveBeenCalledWith(
      mockSession,
      expect.stringContaining(MOOD_RECORD_ENDPOINTS.LAST),
      expect.objectContaining({ method: 'GET' })
    )
  })

  it('uses days param when provided and > 0', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: [mockRecord] })

    await getLastMoodRecords(mockSession, { days: 7 })

    expect(performAuthRequest).toHaveBeenCalledWith(mockSession, expect.stringContaining('days=7'), expect.any(Object))
  })

  it('falls back to limit when days is 0', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: [mockRecord] })

    await getLastMoodRecords(mockSession, { days: 0, limit: 5 })

    const calledUrl: string = (performAuthRequest as jest.Mock).mock.calls[0][1]
    expect(calledUrl).not.toContain('days=')
    expect(calledUrl).toContain('limit=5')
  })

  it('uses limit when days is not provided', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: [mockRecord] })

    await getLastMoodRecords(mockSession, { limit: 3 })

    expect(performAuthRequest).toHaveBeenCalledWith(mockSession, expect.stringContaining('limit=3'), expect.any(Object))
  })

  it('prefers days over limit when both are provided', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: [mockRecord] })

    await getLastMoodRecords(mockSession, { days: 10, limit: 3 })

    const calledUrl: string = (performAuthRequest as jest.Mock).mock.calls[0][1]
    expect(calledUrl).toContain('days=10')
    expect(calledUrl).not.toContain('limit=')
  })

  it('returns error on failure', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Not found' })

    const result = await getLastMoodRecords(mockSession)

    expect(result).toEqual({ error: 'Not found' })
  })
})

describe('getMoodRecordById', () => {
  it('returns data on success', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: mockRecord })

    const result = await getMoodRecordById(mockSession, 'record-1')

    expect(result).toEqual({ data: mockRecord })
    expect(performAuthRequest).toHaveBeenCalledWith(
      mockSession,
      expect.stringContaining('/mood-record/record-1'),
      expect.objectContaining({ method: 'GET' })
    )
  })

  it('returns error on failure', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Not found' })

    const result = await getMoodRecordById(mockSession, 'record-999')

    expect(result).toEqual({ error: 'Not found' })
  })
})
