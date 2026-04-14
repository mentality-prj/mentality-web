import { MOOD_STORY_ENDPOINTS } from '@/constants/endpoints'
import { performAdminRequest, performAuthRequest } from '@/requests/genericFetch'
import { getLatestMoodStory, regenerateMoodStory } from '@/requests/moodStory'
import { MoodStoryEntity } from '@/types/api-responses'
import { CustomSession } from '@/types/auth'

jest.mock('@/requests/genericFetch')

const mockSession: CustomSession = {
  user: { id: 'user-1', name: 'Test User', email: 'user@test.com', role: 'user' as const },
  OAuthToken: 'mock-token',
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
}

const mockStory: MoodStoryEntity = {
  screens: [
    { title: { en: 'Screen 1', uk: 'Екран 1', pl: 'Ekran 1' }, text: { en: 'Body text', uk: 'Текст', pl: 'Treść' } },
    {
      title: { en: 'Screen 2', uk: 'Екран 2', pl: 'Ekran 2' },
      text: { en: 'More text', uk: 'Більше тексту', pl: 'Więcej tekstu' },
      action: {
        type: 'exercise',
        category: 'breathing',
        exerciseId: '65aa50d9fc13ae44e8000001',
        label: { en: 'Try breathing exercise', uk: 'Спробуй дихальну вправу', pl: 'Spróbuj ćwiczenia oddechowego' },
      },
    },
  ],
  recommendedAffirmationId: '65aa50d9fc13ae44e8000002',
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getLatestMoodStory', () => {
  it('returns data on success', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: mockStory })

    const result = await getLatestMoodStory(mockSession)

    expect(result).toEqual({ data: mockStory })
    expect(performAuthRequest).toHaveBeenCalledWith(
      mockSession,
      expect.stringContaining(MOOD_STORY_ENDPOINTS.LATEST),
      expect.objectContaining({ method: 'GET' })
    )
  })

  it('returns error and status on failure', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Server error', status: 500 })

    const result = await getLatestMoodStory(mockSession)

    expect(result).toEqual({ error: 'Server error', status: 500 })
  })

  it('returns error without status when status is absent', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Not found' })

    const result = await getLatestMoodStory(mockSession)

    expect(result).toEqual({ error: 'Not found' })
    expect('status' in result).toBe(false)
  })

  it('propagates 404 status for polling scenarios', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Not Found', status: 404 })

    const result = await getLatestMoodStory(mockSession)

    expect('error' in result).toBe(true)
    if ('error' in result) {
      expect(result.status).toBe(404)
    }
  })

  it('returns error when server returns no data body', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: null })

    const result = await getLatestMoodStory(mockSession)

    expect(result).toEqual({ error: 'No mood story returned from server' })
  })

  it('works with null session', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ data: mockStory })

    const result = await getLatestMoodStory(null)

    expect(result).toEqual({ data: mockStory })
    expect(performAuthRequest).toHaveBeenCalledWith(null, expect.any(String), expect.any(Object))
  })
})

const mockAdminSession: CustomSession = {
  user: { id: 'admin-1', name: 'Admin User', email: 'admin@test.com', role: 'admin' as const },
  OAuthToken: 'mock-admin-token',
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
}

describe('regenerateMoodStory', () => {
  it('returns data on success', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: mockStory })

    const result = await regenerateMoodStory(mockAdminSession)

    expect(result).toEqual({ data: mockStory })
    expect(performAdminRequest).toHaveBeenCalledWith(
      mockAdminSession,
      expect.stringContaining(MOOD_STORY_ENDPOINTS.REGENERATE),
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('returns error when performAdminRequest fails', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ error: 'Unauthorized: Admin role required' })

    const result = await regenerateMoodStory(mockAdminSession)

    expect(result).toEqual({ error: 'Unauthorized: Admin role required' })
  })

  it('returns error when server returns null data', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ data: null })

    const result = await regenerateMoodStory(mockAdminSession)

    expect(result).toEqual({ error: 'No mood story returned from server' })
  })

  it('returns error when called with null session', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ error: 'Unauthorized: Admin role required' })

    const result = await regenerateMoodStory(null)

    expect(result).toEqual({ error: 'Unauthorized: Admin role required' })
    expect(performAdminRequest).toHaveBeenCalledWith(null, expect.any(String), expect.any(Object))
  })

  it('returns error when called with non-admin session', async () => {
    ;(performAdminRequest as jest.Mock).mockResolvedValue({ error: 'Unauthorized: Admin role required' })

    const result = await regenerateMoodStory(mockSession)

    expect(result).toEqual({ error: 'Unauthorized: Admin role required' })
  })
})
