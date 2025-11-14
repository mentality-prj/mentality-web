import { apiRequest } from '@/helpers/api-wrapper'
import { addTag, getTags } from '@/requests/tags'

jest.mock('@/helpers/api-wrapper')
jest.mock('@/lib/logger', () => ({
  __esModule: true,
  logger: {
    warn: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}))

const mockSession = {
  user: {
    email: 'admin@test.com',
    role: 'admin',
  },
  OAuthToken: 'mock-token',
}

const mockTagData = {
  key: 'stress',
  translations: { uk: 'Стрес', en: 'Stress', pl: 'Stres' },
}

describe('Tags API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('addTag', () => {
    it('successfully adds a tag', async () => {
      const mockResponse = {
        id: '1',
        ...mockTagData,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      }
      ;(apiRequest as jest.Mock).mockResolvedValue({
        data: mockResponse,
        error: null,
      })

      const result = await addTag(mockSession as any, mockTagData)

      expect(result.data).toEqual(mockResponse)
      expect(result.error).toBeUndefined()
      expect(apiRequest).toHaveBeenCalledWith(
        mockSession,
        expect.stringContaining('/tags'),
        expect.objectContaining({
          method: 'POST',
          body: { key: mockTagData.key, translations: mockTagData.translations },
        })
      )
    })

    it('returns error for unauthorized user', async () => {
      const unauthorizedSession = {
        user: { email: 'user@test.com', role: 'user' },
      }

      const result = await addTag(unauthorizedSession as any, mockTagData)

      expect(result.error).toBe('Unauthorized: Admin role required')
      expect(apiRequest).not.toHaveBeenCalled()
    })

    it('handles API error', async () => {
      ;(apiRequest as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Tag already exists' },
      })

      const result = await addTag(mockSession as any, mockTagData)

      expect(result.error).toBe('Tag already exists')
    })

    it('returns error for null session', async () => {
      const result = await addTag(null, mockTagData)

      expect(result.error).toBe('Unauthorized: Admin role required')
      expect(apiRequest).not.toHaveBeenCalled()
    })

    it('logs warning for unauthorized attempts', async () => {
      const unauthorizedSession = {
        user: { email: 'user@test.com', role: 'user' },
      }

      await addTag(unauthorizedSession as any, mockTagData)

      const logger = require('@/lib/logger').logger
      expect(logger.warn).toHaveBeenCalledWith(
        'Unauthorized attempt to add tag',
        expect.objectContaining({
          userId: 'user@test.com',
          tagKey: 'stress',
        })
      )
    })
  })

  describe('getTags', () => {
    it('successfully retrieves tags', async () => {
      const mockTags = [
        {
          id: '1',
          key: 'stress',
          translations: { uk: 'Стрес', en: 'Stress', pl: 'Stres' },
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        {
          id: '2',
          key: 'anxiety',
          translations: { uk: 'Тривога', en: 'Anxiety', pl: 'Lęk' },
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ]
      ;(apiRequest as jest.Mock).mockResolvedValue({
        data: mockTags,
        error: null,
      })

      const result = await getTags(mockSession as any)

      expect(result.data).toEqual(mockTags)
      expect(result.error).toBeUndefined()
      expect(apiRequest).toHaveBeenCalledWith(
        mockSession,
        expect.stringContaining('/tags'),
        expect.objectContaining({
          method: 'GET',
        })
      )
    })

    it('returns error for unauthorized user', async () => {
      const unauthorizedSession = {
        user: { email: 'user@test.com', role: 'user' },
      }

      const result = await getTags(unauthorizedSession as any)

      expect(result.error).toBe('Unauthorized: Admin role required')
      expect(apiRequest).not.toHaveBeenCalled()
    })

    it('handles empty array response', async () => {
      ;(apiRequest as jest.Mock).mockResolvedValue({
        data: [],
        error: null,
      })

      const result = await getTags(mockSession as any)

      expect(result.data).toEqual([])
      expect(Array.isArray(result.data)).toBe(true)
    })

    it('handles API error', async () => {
      ;(apiRequest as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Database connection failed' },
      })

      const result = await getTags(mockSession as any)

      expect(result.error).toBe('Database connection failed')
    })

    it('logs info on successful retrieval', async () => {
      ;(apiRequest as jest.Mock).mockResolvedValue({
        data: [{ id: '1' }, { id: '2' }],
        error: null,
      })

      await getTags(mockSession as any)

      const logger = require('@/lib/logger').logger
      expect(logger.info).toHaveBeenCalledWith('Tags retrieved', { count: 2 })
    })
  })
})
