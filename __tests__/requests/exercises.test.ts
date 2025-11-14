import { apiRequest } from '@/helpers/api-wrapper'
import { addExercise, getExercises } from '@/requests/exercises'

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

const mockExerciseData = {
  category: 'breathing exercises',
  title: '4-7-8 Breathing',
  annotation: 'Relaxing breath technique to reduce anxiety',
  description:
    'Inhale quietly through the nose for 4 seconds, hold for 7 seconds, exhale audibly through the mouth for 8 seconds. Repeat for 4 cycles.',
  tags: ['breathing', 'relaxation'],
}

describe('Exercises API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('addExercise', () => {
    it('successfully adds an exercise', async () => {
      const mockResponse = { id: '1', ...mockExerciseData }
      ;(apiRequest as jest.Mock).mockResolvedValue({
        data: mockResponse,
        error: null,
      })

      const result = await addExercise(mockSession as any, mockExerciseData)

      expect(result.data).toEqual(mockResponse)
      expect(result.error).toBeUndefined()
      expect(apiRequest).toHaveBeenCalledWith(
        mockSession,
        expect.stringContaining('/exercises'),
        expect.objectContaining({
          method: 'POST',
          body: mockExerciseData,
        })
      )
    })

    it('returns error for unauthorized user', async () => {
      const unauthorizedSession = {
        user: { email: 'user@test.com', role: 'user' },
      }

      const result = await addExercise(unauthorizedSession as any, mockExerciseData)

      expect(result.error).toBe('Unauthorized: Admin role required')
      expect(apiRequest).not.toHaveBeenCalled()
    })

    it('handles API error', async () => {
      ;(apiRequest as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Network error' },
      })

      const result = await addExercise(mockSession as any, mockExerciseData)

      expect(result.error).toBe('Network error')
    })

    it('returns error for null session', async () => {
      const result = await addExercise(null, mockExerciseData)

      expect(result.error).toBe('Unauthorized: Admin role required')
      expect(apiRequest).not.toHaveBeenCalled()
    })
  })

  describe('getExercises', () => {
    it('successfully retrieves exercises', async () => {
      const mockExercises = [
        { id: '1', ...mockExerciseData },
        { id: '2', ...mockExerciseData },
      ]
      ;(apiRequest as jest.Mock).mockResolvedValue({
        data: mockExercises,
        error: null,
      })

      const result = await getExercises(mockSession as any)

      expect(result.data).toEqual(mockExercises)
      expect(result.error).toBeUndefined()
      expect(apiRequest).toHaveBeenCalledWith(
        mockSession,
        expect.stringContaining('/exercises'),
        expect.objectContaining({
          method: 'GET',
        })
      )
    })

    it('returns error for unauthorized user', async () => {
      const unauthorizedSession = {
        user: { email: 'user@test.com', role: 'user' },
      }

      const result = await getExercises(unauthorizedSession as any)

      expect(result.error).toBe('Unauthorized: Admin role required')
      expect(apiRequest).not.toHaveBeenCalled()
    })

    it('handles empty array response', async () => {
      ;(apiRequest as jest.Mock).mockResolvedValue({
        data: [],
        error: null,
      })

      const result = await getExercises(mockSession as any)

      expect(result.data).toEqual([])
      expect(Array.isArray(result.data)).toBe(true)
    })

    it('handles API error', async () => {
      ;(apiRequest as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Server error' },
      })

      const result = await getExercises(mockSession as any)

      expect(result.error).toBe('Server error')
    })
  })
})
