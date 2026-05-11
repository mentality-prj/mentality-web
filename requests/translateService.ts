import { logger } from '@/lib/logger'
import type { CustomSession } from '@/types/auth'
import type {
  TranslateModelResult,
  TranslateServiceRequestBody,
  TranslateServiceResponse,
} from '@/types/translateService'

import { APIUrl } from './config'
import { performAdminRequest } from './genericFetch'

type RawTranslateResponse = {
  translation?: string
  result?: string
  text?: string
}

function getTranslateServiceEndpoint() {
  return `${APIUrl.trim().replace(/\/+$/, '')}/translate`
}

function getTranslationValue(payload: RawTranslateResponse | undefined) {
  return payload?.translation ?? payload?.result ?? payload?.text ?? ''
}

async function runTranslateModelRequest(
  session: CustomSession | null,
  payload: {
    text: string
    model: string
    targetLanguage: TranslateServiceRequestBody['targetLanguage']
    sourceLanguage: NonNullable<TranslateServiceRequestBody['sourceLanguage']>
  }
): Promise<{ data: TranslateModelResult } | { error: string }> {
  const start = Date.now()
  const response = await performAdminRequest<RawTranslateResponse>(session, getTranslateServiceEndpoint(), {
    method: 'POST',
    body: payload,
  })

  if ('error' in response) {
    logger.error('Failed to translate with model', { error: response.error, model: payload.model })
    return { error: response.error }
  }

  return {
    data: {
      model: payload.model,
      translation: getTranslationValue(response.data),
      durationMs: Date.now() - start,
    },
  }
}

export async function compareTranslateService(
  session: CustomSession | null,
  body: TranslateServiceRequestBody
): Promise<{ data: TranslateServiceResponse } | { error: string }> {
  const normalizedText = body.text.trim()

  if (!normalizedText) {
    return { error: 'text is required' }
  }

  if (!body.modelA || !body.modelB) {
    return { error: 'modelA and modelB are required' }
  }

  if (!body.targetLanguage) {
    return { error: 'targetLanguage is required' }
  }

  const sourceLanguage = body.sourceLanguage ?? 'auto'

  const [modelAResult, modelBResult] = await Promise.all([
    runTranslateModelRequest(session, {
      text: normalizedText,
      model: body.modelA,
      targetLanguage: body.targetLanguage,
      sourceLanguage,
    }),
    runTranslateModelRequest(session, {
      text: normalizedText,
      model: body.modelB,
      targetLanguage: body.targetLanguage,
      sourceLanguage,
    }),
  ])

  if ('error' in modelAResult) {
    return { error: modelAResult.error }
  }

  if ('error' in modelBResult) {
    return { error: modelBResult.error }
  }

  return {
    data: {
      modelA: modelAResult.data,
      modelB: modelBResult.data,
    },
  }
}
