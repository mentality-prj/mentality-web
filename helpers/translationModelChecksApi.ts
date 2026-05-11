import { apiRequestWithAuth } from '@/helpers/api-request-with-auth'
import { APIUrl } from '@/requests/config'
import type { CustomSession } from '@/types/auth'
import type {
  TranslationModelCheckResult,
  TranslationModelCheckModel,
  TranslationModelChecksCompareResponse,
  TranslationModelChecksHelloResponse,
  TranslationModelChecksRequestBody,
} from '@/types/translationModelChecks'

type JsonObject = Record<string, unknown>

type TranslationModelChecksRequestOptions = {
  method?: 'GET' | 'POST'
  body?: Record<string, unknown>
}

function serializeTranslationModelChecksBody(body: TranslationModelChecksRequestBody): Record<string, unknown> {
  return {
    text: body.text,
    sourceLang: body.sourceLang,
    targetLang: body.targetLang,
  }
}

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function getStringValue(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined
}

function getEndpointInfo(path: string): { url: string; host: string; endpoint: string } {
  const trimmedBaseUrl = APIUrl.trim().replace(/\/+$/, '')
  const url = `${trimmedBaseUrl}/translation-model-checks/${path}`
  const isAbsoluteUrl = /^[a-z][a-z\d+.-]*:/i.test(trimmedBaseUrl)

  try {
    const parsed = isAbsoluteUrl ? new URL(url) : new URL(url, 'http://translation-model-checks.local')

    return {
      url: isAbsoluteUrl ? parsed.toString() : url,
      host: isAbsoluteUrl ? parsed.origin : trimmedBaseUrl,
      endpoint: `${parsed.pathname}${parsed.search}`,
    }
  } catch {
    const endpoint = url.replace(/^[a-z][a-z\d+.-]*:\/\/[^/]+/i, '')

    return {
      url,
      host: trimmedBaseUrl,
      endpoint: endpoint.startsWith('/') ? endpoint : `/${endpoint}`,
    }
  }
}

function getTranslationValue(payload: unknown): string {
  if (typeof payload === 'string') {
    return payload
  }

  if (!isJsonObject(payload)) {
    return ''
  }

  return (
    getStringValue(payload.translation) ??
    getStringValue(payload.result) ??
    getStringValue(payload.text) ??
    getStringValue(payload.output) ??
    ''
  )
}

function getCompareNode(payload: JsonObject, model: TranslationModelCheckModel): unknown {
  const direct = payload[model as TranslationModelCheckModel]

  if (direct !== undefined) {
    return direct
  }

  if (model === 'helsinki') {
    return payload.helsinkiResult ?? payload.helsinkiResponse ?? { translation: payload.helsinkiTranslation }
  }

  return payload.facebookResult ?? payload.facebookResponse ?? { translation: payload.facebookTranslation }
}

async function requestTranslationModelChecks<T>(
  session: CustomSession | null,
  path: string,
  options: TranslationModelChecksRequestOptions = {}
): Promise<{ data: T; endpoint: string; host: string }> {
  const { url, endpoint, host } = getEndpointInfo(path)
  const { data, error } = await apiRequestWithAuth<T>(session, url, {
    method: options.method ?? 'GET',
    body: options.body,
  })

  if (error) {
    throw new Error(`${error.status ?? 500}: ${error.message}`)
  }

  return {
    data: data as T,
    endpoint,
    host,
  }
}

export async function checkTranslationModelChecksHello(
  session: CustomSession | null
): Promise<TranslationModelChecksHelloResponse> {
  const { data, endpoint, host } = await requestTranslationModelChecks<unknown>(session, 'hello')
  const record = isJsonObject(data) ? data : undefined

  return {
    host: getStringValue(record?.host) ?? host,
    endpoint: getStringValue(record?.endpoint) ?? endpoint,
    data: record && 'data' in record ? record.data : data,
  }
}

export async function runHelsinkiTranslationModelCheck(
  session: CustomSession | null,
  body: TranslationModelChecksRequestBody
): Promise<TranslationModelCheckResult> {
  const { data, endpoint } = await requestTranslationModelChecks<unknown>(session, 'helsinki', {
    method: 'POST',
    body: serializeTranslationModelChecksBody(body),
  })
  const record = isJsonObject(data) ? data : undefined

  return {
    model: 'helsinki',
    sourceLang: body.sourceLang,
    targetLang: body.targetLang,
    translation: getTranslationValue(data),
    endpoint: getStringValue(record?.endpoint) ?? endpoint,
    raw: data,
  }
}

export async function runFacebookTranslationModelCheck(
  session: CustomSession | null,
  body: TranslationModelChecksRequestBody
): Promise<TranslationModelCheckResult> {
  const { data, endpoint } = await requestTranslationModelChecks<unknown>(session, 'facebook', {
    method: 'POST',
    body: serializeTranslationModelChecksBody(body),
  })
  const record = isJsonObject(data) ? data : undefined

  return {
    model: 'facebook',
    sourceLang: body.sourceLang,
    targetLang: body.targetLang,
    translation: getTranslationValue(data),
    endpoint: getStringValue(record?.endpoint) ?? endpoint,
    raw: data,
  }
}

export async function runCompareTranslationModelCheck(
  session: CustomSession | null,
  body: TranslationModelChecksRequestBody
): Promise<TranslationModelChecksCompareResponse> {
  const { data, endpoint } = await requestTranslationModelChecks<unknown>(session, 'compare', {
    method: 'POST',
    body: serializeTranslationModelChecksBody(body),
  })
  const record = isJsonObject(data) ? data : {}
  const helsinkiPayload = getCompareNode(record, 'helsinki')
  const facebookPayload = getCompareNode(record, 'facebook')
  const helsinkiRecord = isJsonObject(helsinkiPayload) ? helsinkiPayload : undefined
  const facebookRecord = isJsonObject(facebookPayload) ? facebookPayload : undefined

  return {
    endpoint: getStringValue(record.endpoint) ?? endpoint,
    helsinki: {
      model: 'helsinki',
      sourceLang: body.sourceLang,
      targetLang: body.targetLang,
      translation: getTranslationValue(helsinkiPayload),
      endpoint: getStringValue(helsinkiRecord?.endpoint) ?? endpoint,
      raw: helsinkiPayload,
    },
    facebook: {
      model: 'facebook',
      sourceLang: body.sourceLang,
      targetLang: body.targetLang,
      translation: getTranslationValue(facebookPayload),
      endpoint: getStringValue(facebookRecord?.endpoint) ?? endpoint,
      raw: facebookPayload,
    },
    raw: data,
  }
}
