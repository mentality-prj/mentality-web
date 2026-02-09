import { apiRequestWithAuth } from '@/helpers/api-request-with-auth'
import { logger } from '@/lib/logger'
import { mapExercises } from '@/mappers/exercise.mappers'
import { CreateExerciseDto, ExerciseCategory, ExerciseEntity, GeneratedExercise } from '@/types/api-responses'
import { CustomSession } from '@/types/auth'
import { SupportedLanguage } from '@/types/languages'
import { Roles } from '@/types/security'

import { APIUrl } from './config'
import { performAdminRequest } from './genericFetch'

type ApiResult<T> = { data?: T; error?: string }

export function checkAdmin(session: CustomSession | null, action: string, extraData?: Record<string, unknown>) {
  if (!session?.user || session.user.role !== Roles.ADMIN) {
    logger.warn(`Unauthorized attempt to ${action}`, {
      userId: session?.user?.email,
      role: session?.user?.role,
      ...extraData,
    })
    return { error: 'Unauthorized: Admin role required' }
  }
  return null
}

function formatError(error: unknown): { error: string } {
  return {
    error:
      typeof error === 'object' && error !== null && 'message' in error
        ? (error as { message: string }).message
        : String(error),
  }
}

function logAndReturnError(loggerMsg: string, error: unknown, meta?: Record<string, unknown>) {
  logger.error(loggerMsg, { error, ...meta })
  return formatError(error)
}

export async function addExercise(
  session: CustomSession | null,
  exerciseData: CreateExerciseDto
): Promise<ApiResult<ExerciseEntity>> {
  const check = checkAdmin(session, 'add exercise')
  if (check) return check

  const { data, error } = await apiRequestWithAuth<ExerciseEntity>(session, `${APIUrl}/exercises`, {
    method: 'POST',
    body: exerciseData,
  })

  if (error) {
    return logAndReturnError('Failed to add exercise', error)
  }

  logger.info('Exercise successfully added', { exerciseId: data?.id })
  return { data }
}

export async function getExercises(session: CustomSession | null): Promise<ApiResult<ExerciseEntity[]>> {
  const check = checkAdmin(session, 'get exercise')
  if (check) return check

  const { data, error } = await apiRequestWithAuth<ExerciseEntity[]>(session, `${APIUrl}/exercises`, {
    method: 'GET',
  })

  if (error) {
    return logAndReturnError('Failed to get exercises', error)
  }

  const exercises = Array.isArray(data)
    ? data
    : data && typeof data === 'object' && 'data' in data && Array.isArray((data as { data?: unknown }).data)
      ? (data as { data: ExerciseEntity[] }).data
      : []
  const cleaned = mapExercises(exercises)
  logger.info('Exercises retrieved', { count: cleaned.length })
  return { data: cleaned }
}

export async function getCorrectedExercises(session: CustomSession | null): Promise<ApiResult<ExerciseEntity[]>> {
  const check = checkAdmin(session, 'get corrected exercises')
  if (check) return check

  const { data, error } = await apiRequestWithAuth<ExerciseEntity[]>(session, `${APIUrl}/exercises/corrected`, {
    method: 'GET',
  })

  if (error) {
    return logAndReturnError('Failed to get corrected exercises', error)
  }

  const exercises = Array.isArray(data)
    ? data
    : data && typeof data === 'object' && 'data' in data && Array.isArray((data as { data?: unknown }).data)
      ? (data as { data: ExerciseEntity[] }).data
      : []
  const cleaned = mapExercises(exercises)
  logger.info('Corrected exercises retrieved', { count: cleaned.length })
  return { data: cleaned }
}

export async function getUnpublishedExercises(
  session: CustomSession | null,
  page = 1,
  limit = 10
): Promise<{ data: { items: ExerciseEntity[]; total: number } } | { error: string }> {
  const check = checkAdmin(session, 'get unpublished exercises')
  if (check) return check as { error: string }

  const url = `${APIUrl}/exercises/unpublished?page=${page}&limit=${limit}`
  const res = await performAdminRequest<ExerciseEntity[]>(session, url, { method: 'GET' })

  if ('error' in res) {
    logger.error('Failed to get unpublished exercises', { error: res.error })
    return { error: res.error }
  }

  const items = Array.isArray(res.data) ? res.data : []
  const cleanedItems = mapExercises(items)
  const headerTotal = res.headers?.get('X-Total-Count') ?? res.headers?.get('x-total-count')
  const total = headerTotal ? parseInt(headerTotal, 10) || items.length : items.length
  logger.info('Unpublished exercises retrieved', { count: cleanedItems.length, total })
  return { data: { items: cleanedItems, total } }
}

export async function updateExercise(
  session: CustomSession | null,
  exerciseId: string,
  exerciseData: CreateExerciseDto
): Promise<ApiResult<ExerciseEntity>> {
  const check = checkAdmin(session, 'update exercise', { exerciseId })
  if (check) return check

  const { data, error } = await apiRequestWithAuth<ExerciseEntity>(session, `${APIUrl}/exercises/${exerciseId}`, {
    method: 'PATCH',
    body: exerciseData,
  })

  if (error) {
    return logAndReturnError('Failed to update exercise', error, { exerciseId })
  }

  logger.info('Exercise successfully updated', { exerciseId: data?.id })
  return { data }
}

export async function deleteExercise(
  session: CustomSession | null,
  exerciseId: string
): Promise<ApiResult<ExerciseEntity>> {
  const check = checkAdmin(session, 'delete exercise', { exerciseId })
  if (check) return check

  const res = await performAdminRequest<ExerciseEntity>(session, `${APIUrl}/exercises/${exerciseId}`, {
    method: 'DELETE',
  })

  if ('error' in res) {
    return logAndReturnError('Failed to delete exercise', res.error, { exerciseId })
  }

  logger.info('Exercise successfully deleted', { exerciseId: res.data?.id ?? exerciseId })
  return { data: res.data }
}

export async function publishExercise(session: CustomSession | null, id: string) {
  if (!session?.user || session.user.role !== Roles.ADMIN) {
    logger.warn('Unauthorized attempt to publish exercise', {
      userId: session?.user?.email,
      role: session?.user?.role,
    })
    return { error: 'Unauthorized: Admin role required' }
  }

  const res = await performAdminRequest<ExerciseEntity>(session, `${APIUrl}/exercises/${id}`, {
    method: 'PATCH',
    body: { isPublished: true },
  })

  if ('error' in res) {
    logger.error('Failed to publish exercise', { error: res.error, id })
    return { error: res.error }
  }

  logger.info('Exercise published', { id })
  return { data: res.data }
}

export async function generateExercise(
  session: CustomSession | null,
  prompt: string | undefined,
  category: ExerciseCategory,
  lang?: SupportedLanguage
): Promise<ApiResult<GeneratedExercise>> {
  const check = checkAdmin(session, 'generate exercise')
  if (check) return check

  const body: Record<string, unknown> = { category }
  if (prompt && prompt.trim() !== '') {
    body.prompt = prompt.trim()
    if (lang) body.lang = lang
  }

  const res = await performAdminRequest<GeneratedExercise>(session, `${APIUrl}/exercises/generate`, {
    method: 'POST',
    body,
  })

  if ('error' in res) {
    logger.error('Failed to generate exercise', { error: res.error, prompt, category, lang })
    return { error: res.error }
  }

  logger.info('Exercise successfully generated', { lang, category })
  return { data: res.data }
}

export async function fetchExercisesItems(
  session: CustomSession | null
): Promise<{ items: ExerciseEntity[]; error?: string }> {
  const res = await getExercises(session)
  if ('error' in res) return { items: [], error: res.error }

  let items: ExerciseEntity[] = []

  if ('data' in res) {
    if (Array.isArray(res.data)) {
      items = res.data
    } else if (
      res.data &&
      typeof res.data === 'object' &&
      'items' in res.data &&
      Array.isArray((res.data as { items?: unknown }).items)
    ) {
      items = (res.data as { items: ExerciseEntity[] }).items
    }
  }

  return { items }
}
