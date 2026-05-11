import { apiRequestWithAuth } from '@/helpers/api-request-with-auth'
import {
  checkTranslationModelChecksHello,
  runCompareTranslationModelCheck,
  runFacebookTranslationModelCheck,
  runHelsinkiTranslationModelCheck,
} from '@/helpers/translationModelChecksApi'

jest.mock('@/helpers/api-request-with-auth', () => ({
  apiRequestWithAuth: jest.fn(),
}))

jest.mock('@/requests/config', () => ({
  APIUrl: 'http://localhost:3200/api/',
}))

const mockSession = {
  user: {
    email: 'admin@test.com',
    role: 'admin',
  },
  OAuthToken: 'mock-token',
}

const mockBody = {
  text: 'Привіт світе',
  sourceLang: 'uk',
  targetLang: 'pl',
} as const

describe('translationModelChecksApi', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('checkTranslationModelChecksHello', () => {
    it('calls the hello endpoint and uses backend host and endpoint when provided', async () => {
      ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({
        data: {
          host: 'http://translation-service:3200',
          endpoint: '/translation-model-checks/hello',
          data: { status: 'ok' },
        },
      })

      const result = await checkTranslationModelChecksHello(mockSession as never)

      expect(apiRequestWithAuth).toHaveBeenCalledWith(
        mockSession,
        'http://localhost:3200/api/translation-model-checks/hello',
        {
          method: 'GET',
          body: undefined,
        }
      )
      expect(result).toEqual({
        host: 'http://translation-service:3200',
        endpoint: '/translation-model-checks/hello',
        data: { status: 'ok' },
      })
    })

    it('falls back to derived host and endpoint when response is not an object', async () => {
      ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({
        data: 'ok',
      })

      const result = await checkTranslationModelChecksHello(mockSession as never)

      expect(result).toEqual({
        host: 'http://localhost:3200',
        endpoint: '/api/translation-model-checks/hello',
        data: 'ok',
      })
    })

    it('preserves the base path in derived endpoint when APIUrl is relative', async () => {
      jest.resetModules()

      const isolatedApiRequestWithAuth = jest.fn().mockResolvedValue({
        data: 'ok',
      })

      jest.doMock('@/helpers/api-request-with-auth', () => ({
        apiRequestWithAuth: isolatedApiRequestWithAuth,
      }))

      jest.doMock('@/requests/config', () => ({
        APIUrl: '/api/',
      }))

      const { checkTranslationModelChecksHello: checkHelloWithRelativeApiUrl } =
        await import('@/helpers/translationModelChecksApi')

      const result = await checkHelloWithRelativeApiUrl(mockSession as never)

      expect(isolatedApiRequestWithAuth).toHaveBeenCalledWith(mockSession, '/api/translation-model-checks/hello', {
        method: 'GET',
        body: undefined,
      })

      expect(result).toEqual({
        host: '/api',
        endpoint: '/api/translation-model-checks/hello',
        data: 'ok',
      })
    })
  })

  describe('runHelsinkiTranslationModelCheck', () => {
    it('posts the serialized body and normalizes translation fields', async () => {
      ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({
        data: {
          result: 'Witaj swiecie',
          endpoint: '/v1/translate',
        },
      })

      const result = await runHelsinkiTranslationModelCheck(mockSession as never, mockBody)

      expect(apiRequestWithAuth).toHaveBeenCalledWith(
        mockSession,
        'http://localhost:3200/api/translation-model-checks/helsinki',
        {
          method: 'POST',
          body: {
            text: 'Привіт світе',
            sourceLang: 'uk',
            targetLang: 'pl',
          },
        }
      )
      expect(result).toEqual({
        model: 'helsinki',
        sourceLang: 'uk',
        targetLang: 'pl',
        translation: 'Witaj swiecie',
        endpoint: '/v1/translate',
        raw: {
          result: 'Witaj swiecie',
          endpoint: '/v1/translate',
        },
      })
    })
  })

  describe('runFacebookTranslationModelCheck', () => {
    it('throws a normalized error when the API returns an error object', async () => {
      ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({
        error: {
          status: 422,
          message: 'Invalid language pair',
        },
      })

      await expect(runFacebookTranslationModelCheck(mockSession as never, mockBody)).rejects.toThrow(
        '422: Invalid language pair'
      )
    })
  })

  describe('runCompareTranslationModelCheck', () => {
    it('maps legacy compare payload fields into normalized Helsinki and Facebook results', async () => {
      ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({
        data: {
          helsinkiTranslation: 'Helsinki wynik',
          facebookTranslation: 'Facebook wynik',
        },
      })

      const result = await runCompareTranslationModelCheck(mockSession as never, mockBody)

      expect(apiRequestWithAuth).toHaveBeenCalledWith(
        mockSession,
        'http://localhost:3200/api/translation-model-checks/compare',
        {
          method: 'POST',
          body: {
            text: 'Привіт світе',
            sourceLang: 'uk',
            targetLang: 'pl',
          },
        }
      )
      expect(result).toEqual({
        endpoint: '/api/translation-model-checks/compare',
        helsinki: {
          model: 'helsinki',
          sourceLang: 'uk',
          targetLang: 'pl',
          translation: 'Helsinki wynik',
          endpoint: '/api/translation-model-checks/compare',
          raw: {
            translation: 'Helsinki wynik',
          },
        },
        facebook: {
          model: 'facebook',
          sourceLang: 'uk',
          targetLang: 'pl',
          translation: 'Facebook wynik',
          endpoint: '/api/translation-model-checks/compare',
          raw: {
            translation: 'Facebook wynik',
          },
        },
        raw: {
          helsinkiTranslation: 'Helsinki wynik',
          facebookTranslation: 'Facebook wynik',
        },
      })
    })
  })
})
