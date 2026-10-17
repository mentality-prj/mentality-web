import { MOOD_RECORD_ENDPOINTS } from '@/constants/endpoints'
import { apiRequestWithAuth } from '@/helpers/api-request-with-auth'
import { logger } from '@/lib/logger'
import { parseMoodQuery } from '@/lib/moodQueryParser'
import { performAuthRequest } from '@/requests/genericFetch'
import { createMoodRecord, getLastMoodRecords, getMoodRecordById, getMoodRecords } from '@/requests/moodRecord'
import { CreateMoodRecordDto, MoodRecordEntity } from '@/types/api-responses'
import { CustomSession } from '@/types/auth'

jest.mock('@/helpers/api-request-with-auth')
jest.mock('@/requests/genericFetch', () => {
  const actual = jest.requireActual('@/requests/genericFetch')
  return { ...actual, performAuthRequest: jest.fn(actual.performAuthRequest) }
})
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
  it('rejects a malformed creation response', async () => {
    ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ data: {} })

    expect(await createMoodRecord(mockSession, mockDto)).toEqual({
      error: 'Invalid mood record response from backend',
      status: 502,
    })
  })

  it('returns data on success', async () => {
    ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ data: mockRecord })

    const result = await createMoodRecord(mockSession, mockDto)

    expect(result).toEqual({ data: mockRecord })
    expect(performAuthRequest).toHaveBeenCalledWith(
      mockSession,
      expect.stringContaining(MOOD_RECORD_ENDPOINTS.BASE),
      expect.objectContaining({ method: 'POST', body: mockDto })
    )
  })

  it('returns error and logs on failure', async () => {
    ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ error: 'Server error' })

    const result = await createMoodRecord(mockSession, mockDto)

    expect(result).toEqual({ error: 'Server error' })
    expect(logger.error).toHaveBeenCalledWith('Failed to create mood record', { error: 'Server error' })
  })

  it('works with null session', async () => {
    ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ data: mockRecord })

    const result = await createMoodRecord(null, mockDto)

    expect(result).toEqual({ data: mockRecord })
    expect(performAuthRequest).toHaveBeenCalledWith(null, expect.any(String), expect.any(Object))
  })
})

describe('getLastMoodRecords IANA local day', () => {
  it('forwards the IANA zone alongside days', async () => {
    ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ data: [] })
    await getLastMoodRecords(mockSession, { days: 1, timeZone: 'Europe/Kyiv' })
    const url = (performAuthRequest as jest.Mock).mock.calls[0][1] as string
    expect(new URL(url).searchParams.get('timeZone')).toBe('Europe/Kyiv')
  })
})

describe('getMoodRecords', () => {
  it('returns data without params', async () => {
    ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ data: [mockRecord] })

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
    ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ data: [mockRecord] })

    await getMoodRecords(mockSession, { page: 2 })

    expect(performAuthRequest).toHaveBeenCalledWith(mockSession, expect.stringContaining('page=2'), expect.any(Object))
  })

  it('appends limit param to url', async () => {
    ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ data: [mockRecord] })

    await getMoodRecords(mockSession, { limit: 10 })

    expect(performAuthRequest).toHaveBeenCalledWith(
      mockSession,
      expect.stringContaining('limit=10'),
      expect.any(Object)
    )
  })

  it('appends both page and limit params', async () => {
    ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ data: [mockRecord] })

    await getMoodRecords(mockSession, { page: 3, limit: 5 })

    const calledUrl: string = (performAuthRequest as jest.Mock).mock.calls[0][1]
    expect(calledUrl).toContain('page=3')
    expect(calledUrl).toContain('limit=5')
  })

  it('preserves upstream 401 on failed history requests', async () => {
    ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({
      error: { name: 'Unauthorized', message: 'Unauthorized', status: 401 },
    })

    await expect(getMoodRecords(mockSession)).resolves.toEqual({ error: 'Unauthorized', status: 401 })
  })

  it('returns error on failure', async () => {
    ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ error: 'Unauthorized' })

    const result = await getMoodRecords(mockSession)

    expect(result).toEqual({ error: 'Unauthorized' })
  })

  it('rejects malformed successful responses instead of treating them as empty history', async () => {
    ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ data: { message: 'wrong payload' } })

    expect(await getMoodRecords(mockSession)).toEqual({
      error: 'Invalid mood record response from backend',
      status: 502,
    })
  })

  it('rejects invalid individual records rather than returning corrupt UI data', async () => {
    ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ data: [{ ...mockRecord, stressLevel: 'high' }] })

    expect(await getMoodRecords(mockSession)).toEqual({
      error: 'Invalid mood record response from backend',
      status: 502,
    })
  })

  it('rejects non-integer and out-of-range mood scales', async () => {
    for (const invalidLevel of [0, 2.5, 6]) {
      ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ data: [{ ...mockRecord, moodLevel: invalidLevel }] })

      expect(await getMoodRecords(mockSession)).toEqual({
        error: 'Invalid mood record response from backend',
        status: 502,
      })
    }
    ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ data: [{ ...mockRecord, energyLevel: 0 }] })

    expect(await getMoodRecords(mockSession)).toEqual({
      error: 'Invalid mood record response from backend',
      status: 502,
    })
  })

  it('rejects invalid dates that would break downstream summary rendering', async () => {
    ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({
      data: [{ ...mockRecord, createdAt: 'not-a-date' }],
    })

    expect(await getMoodRecords(mockSession)).toEqual({
      error: 'Invalid mood record response from backend',
      status: 502,
    })
  })

  it('validates history in the shared transport exactly once', async () => {
    ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ data: [mockRecord] })

    await getMoodRecords(mockSession)

    const options = (performAuthRequest as jest.Mock).mock.calls[0][2]
    expect(options.decodeResponse).toEqual(expect.any(Function))
    expect(options.decodeResponse([{ ...mockRecord, stressLevel: 'invalid' }])).toEqual({
      success: false,
      error: 'Invalid mood record response from backend',
    })
  })

  it('accepts a real empty history as a valid result', async () => {
    ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ data: [] })

    expect(await getMoodRecords(mockSession)).toEqual({ data: { moodNotes: [], total: 0 } })
  })

  describe('query params', () => {
    it('forwards combined stress, energy, tags, and weekdays to the backend', async () => {
      ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ data: [mockRecord] })

      await getMoodRecords(
        mockSession,
        parseMoodQuery({
          page: '12',
          stressLevel: 'high',
          energyLevel: 'low',
          tags: ['work', 'home'],
          weekdays: 'weekDays',
        })
      )

      const calledUrl: string = (performAuthRequest as jest.Mock).mock.calls[0][1]
      const urlParams = new URL(calledUrl).searchParams

      expect(urlParams.get('page')).toBe('12')
      expect(urlParams.get('stressMin')).toBe('4')
      expect(urlParams.get('stressMax')).toBe('4')
      expect(urlParams.get('energyMin')).toBe('2')
      expect(urlParams.get('energyMax')).toBe('2')
      expect(urlParams.getAll('tags')).toEqual(['work', 'home'])
      expect(urlParams.getAll('weekdays')).toEqual(['1', '2', '3', '4', '5'])
    })

    it('sends the IANA timezone with weekdays to support local-day filtering', async () => {
      ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ data: [mockRecord] })

      const query = parseMoodQuery({ weekdays: 'sun', timeZone: 'America/New_York' })
      await getMoodRecords(mockSession, query)

      const calledUrl: string = (performAuthRequest as jest.Mock).mock.calls[0][1]
      const params = new URL(calledUrl).searchParams
      expect(params.getAll('weekdays')).toEqual(['7'])
      expect(params.get('timeZone')).toBe('America/New_York')
    })

    it('sends oldest-first sorting to the backend before pagination', async () => {
      ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ data: [mockRecord] })

      await getMoodRecords(mockSession, parseMoodQuery({ page: '2', order: 'oldest' }))

      const calledUrl: string = (performAuthRequest as jest.Mock).mock.calls[0][1]
      const params = new URL(calledUrl).searchParams
      expect(params.get('order')).toBe('oldest')
      expect(params.get('page')).toBe('2')
    })

    it('forwards non-contiguous multi-level filters to the API', async () => {
      ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ data: [mockRecord] })

      const query = parseMoodQuery({
        moodLevel: 'veryBad,great',
        stressLevel: 'low,veryHigh',
        energyLevel: 'veryLow,high',
        focusLevel: 'low,veryHigh',
        weekdays: 'weekends',
      })
      await getMoodRecords(mockSession, query)

      const calledUrl: string = (performAuthRequest as jest.Mock).mock.calls[0][1]
      const params = new URL(calledUrl).searchParams
      expect(params.getAll('moodLevels')).toEqual(['1', '5'])
      expect(params.getAll('stressLevels')).toEqual(['2', '5'])
      expect(params.getAll('energyLevels')).toEqual(['1', '4'])
      expect(params.getAll('focusLevels')).toEqual(['2', '5'])
      expect(params.getAll('weekdays')).toEqual(['6', '7'])
      expect(params.has('moodMin')).toBe(false)
      expect(params.has('stressMin')).toBe(false)
    })

    it('includes repeated tags and weekdays correctly in URL', async () => {
      ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ data: [mockRecord] })

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
      ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({
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
      ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({
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
  it('rejects an unexpected summary payload', async () => {
    ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ data: null })

    expect(await getLastMoodRecords(mockSession)).toEqual({
      error: 'Invalid mood record response from backend',
      status: 502,
    })
  })

  it('returns data without params', async () => {
    ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ data: [mockRecord] })

    const result = await getLastMoodRecords(mockSession)

    expect(result).toEqual({ data: [mockRecord] })
    expect(performAuthRequest).toHaveBeenCalledWith(
      mockSession,
      expect.stringContaining(MOOD_RECORD_ENDPOINTS.LAST),
      expect.objectContaining({ method: 'GET' })
    )
  })

  it('uses days param when provided and > 0', async () => {
    ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ data: [mockRecord] })

    await getLastMoodRecords(mockSession, { days: 7 })

    expect(performAuthRequest).toHaveBeenCalledWith(mockSession, expect.stringContaining('days=7'), expect.any(Object))
  })

  it('falls back to limit when days is 0', async () => {
    ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ data: [mockRecord] })

    await getLastMoodRecords(mockSession, { days: 0, limit: 5 })

    const calledUrl: string = (performAuthRequest as jest.Mock).mock.calls[0][1]
    expect(calledUrl).not.toContain('days=')
    expect(calledUrl).toContain('limit=5')
  })

  it('uses limit when days is not provided', async () => {
    ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ data: [mockRecord] })

    await getLastMoodRecords(mockSession, { limit: 3 })

    expect(performAuthRequest).toHaveBeenCalledWith(mockSession, expect.stringContaining('limit=3'), expect.any(Object))
  })

  it('prefers days over limit when both are provided', async () => {
    ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ data: [mockRecord] })

    await getLastMoodRecords(mockSession, { days: 10, limit: 3 })

    const calledUrl: string = (performAuthRequest as jest.Mock).mock.calls[0][1]
    expect(calledUrl).toContain('days=10')
    expect(calledUrl).not.toContain('limit=')
  })

  it('returns error on failure', async () => {
    ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ error: 'Not found' })

    const result = await getLastMoodRecords(mockSession)

    expect(result).toEqual({ error: 'Not found' })
  })
})

describe('getMoodRecordById', () => {
  it('rejects an invalid record DTO', async () => {
    ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ data: { id: 'missing-values' } })

    expect(await getMoodRecordById(mockSession, 'bad')).toEqual({
      error: 'Invalid mood record response from backend',
      status: 502,
    })
  })

  it('returns data on success', async () => {
    ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ data: mockRecord })

    const result = await getMoodRecordById(mockSession, 'record-1')

    expect(result).toEqual({ data: mockRecord })
    expect(performAuthRequest).toHaveBeenCalledWith(
      mockSession,
      expect.stringContaining('/mood-record/record-1'),
      expect.objectContaining({ method: 'GET' })
    )
  })

  it('returns error on failure', async () => {
    ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ error: 'Not found' })

    const result = await getMoodRecordById(mockSession, 'record-999')

    expect(result).toEqual({ error: 'Not found' })
  })
})
