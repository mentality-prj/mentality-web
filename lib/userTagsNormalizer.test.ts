import { fetchNormalizedUserTags } from '@/lib/userTagsNormalizer'
import { getUserTags } from '@/requests/userTags'
import type { CustomSession } from '@/types/auth'

jest.mock('@/requests/userTags', () => ({
  getUserTags: jest.fn(),
}))

const mockSession: CustomSession = {
  user: {
    id: 'user-1',
    name: 'Test User',
    email: 'user@test.com',
    role: 'user',
  },
  OAuthToken: 'mock-token',
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
}

describe('userTags normalization helper', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('normalizes user tags before returning them', async () => {
    ;(getUserTags as jest.Mock).mockResolvedValue({
      data: [
        { key: ' focus ', name: ' Focus ' },
        { key: '', name: 'Missing key' },
        { key: '   ', name: 'Whitespace key' },
        { key: 123, name: 'Wrong type' },
        { key: 'calm', name: undefined },
      ],
    })

    const result = await fetchNormalizedUserTags(mockSession)

    expect(result).toEqual({
      data: [
        { key: 'focus', name: 'Focus' },
        { key: 'calm', name: '' },
      ],
    })
  })

  it('keeps normalized upstream string errors unchanged', async () => {
    ;(getUserTags as jest.Mock).mockResolvedValue({ error: 'Unauthorized: Login required' })

    const result = await fetchNormalizedUserTags(mockSession)

    expect(result).toEqual({ error: 'Unauthorized: Login required' })
  })

  it('normalizes thrown errors to a string message', async () => {
    ;(getUserTags as jest.Mock).mockRejectedValue(new Error('Network failed'))

    const result = await fetchNormalizedUserTags(mockSession)

    expect(result).toEqual({ error: 'Network failed' })
  })
})
