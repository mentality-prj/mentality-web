import { apiRequestWithAuth } from '@/helpers/apiRequestWithAuth'
import { logger } from '@/lib/logger'
import { CreateExerciseDto, ExerciseEntity } from '@/types/api-responses'
import { CustomSession } from '@/types/auth'
import { Roles } from '@/types/security'

import { APIUrl } from './config'

export async function addExercise(session: CustomSession | null, exerciseData: CreateExerciseDto) {
  if (!session?.user || session.user.role !== Roles.ADMIN) {
    logger.warn('Unauthorized attempt to add exercise', {
      userId: session?.user?.email,
      role: session?.user?.role,
    })
    return { error: 'Unauthorized: Admin role required' }
  }

  const { data, error } = await apiRequestWithAuth<ExerciseEntity>(session, `${APIUrl}/exercises`, {
    method: 'POST',
    body: exerciseData,
  })

  if (error) {
    logger.error('Failed to add exercise', { error })
    return {
      error:
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message: string }).message
          : String(error),
    }
  }

  logger.info('Exercise successfully added', { exerciseId: data?.id })
  return { data }
}

export async function getExercises(session: CustomSession | null) {
  if (!session?.user || session.user.role !== Roles.ADMIN) {
    logger.warn('Unauthorized attempt to get exercises', {
      userId: session?.user?.email,
      role: session?.user?.role,
    })
    return { error: 'Unauthorized: Admin role required' }
  }

  const { data, error } = await apiRequestWithAuth<ExerciseEntity[]>(session, `${APIUrl}/exercises`, {
    method: 'GET',
  })

  if (error) {
    logger.error('Failed to get exercises', { error })
    return {
      error:
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message: string }).message
          : String(error),
    }
  }

  const exercises = Array.isArray(data)
    ? data
    : data && typeof data === 'object' && 'data' in data && Array.isArray((data as { data?: unknown }).data)
      ? (data as { data: ExerciseEntity[] }).data
      : []
  logger.info('Exercises retrieved', { count: Array.isArray(exercises) ? exercises.length : 0 })
  return { data: exercises }
}
