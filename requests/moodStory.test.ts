import { MOOD_STORY_ENDPOINTS } from '@/constants/endpoints'
import { performAuthRequest } from '@/requests/genericFetch'
import { getLatestMoodStory } from '@/requests/moodStory'
import { MoodStoryEntity } from '@/types/api-responses'
import { CustomSession } from '@/types/auth'

jest.mock('@/requests/genericFetch')

const mockSession: CustomSession = {
  user: { email: 'user@test.com', role: 'user' as const },
  OAuthToken: 'mock-token',
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
}

const mockStory: MoodStoryEntity = {
  screens: [
    { title: 'Screen 1', text: 'Body text' },
    { title: 'Screen 2', text: 'More text', action: 'Дихальні вправи' },
  ],
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
