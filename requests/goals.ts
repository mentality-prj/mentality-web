import { apiRequestWithAuth } from '../helpers/apiRequestWithAuth'
import logger from '../lib/logger'
import { CreateGoalDto, GoalEntity, UpdateGoalDto } from '../types/api-responses'
import { CustomSession } from '../types/auth'
import { ApiResult } from '../types/requests'

import { APIUrl } from './config'

export async function getGoals(session: CustomSession | null) {
  if (!session?.user) {
    logger.warn('Unauthorized attempt to get goals', {
      userId: session?.user?.email,
      role: session?.user?.role,
    })
    return { error: 'Unauthorized' }
  }

  const { data, error } = await apiRequestWithAuth<GoalEntity[]>(session, `${APIUrl}/goals`, {
    method: 'GET',
  })

  if (error) {
    logger.error('Failed to get goals', { error })
    return {
      error:
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message: string }).message
          : String(error),
    }
  }

  const goals = Array.isArray(data) ? data : []

  logger.info('Goals retrieved', { count: goals.length })

  return { data: goals }
}

export async function createGoal(session: CustomSession | null, goalData: CreateGoalDto) {
  if (!session?.user) {
    logger.warn('Unauthorized attempt to add goal', {
      userId: session?.user?.email,
      role: session?.user?.role,
    })
    return { error: 'Unauthorized' }
  }

  const { data, error } = await apiRequestWithAuth<GoalEntity>(session, `${APIUrl}/goals`, {
    method: 'POST',
    body: goalData,
  })

  if (error) {
    logger.error('Failed to add goal', { error })
    return {
      error:
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message: string }).message
          : String(error),
    }
  }

  logger.info('Goal successfully added', { goalId: data?.id })
  return { data }
}

export async function updateGoal(
  session: CustomSession | null,
  goalId: string,
  goalData: UpdateGoalDto
): Promise<ApiResult<GoalEntity>> {
  if (!session?.user) {
    logger.warn('Unauthorized attempt to update goal', {
      userId: session?.user?.email,
      role: session?.user?.role,
    })
    return { error: 'Unauthorized' }
  }

  const { data, error } = await apiRequestWithAuth<GoalEntity>(session, `${APIUrl}/goals/${goalId}`, {
    method: 'PATCH',
    body: goalData,
  })

  if (error) {
    logger.error('Failed to update goal', { error })
    return {
      error:
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message: string }).message
          : String(error),
    }
  }

  if (!data) {
    return { error: 'Goal update failed' }
  }

  logger.info('Goal successfully updated', { goalId: data?.id })
  return { data }
}

export async function deleteGoal(session: CustomSession | null, goalId: string): Promise<ApiResult<boolean>> {
  if (!session?.user) {
    logger.warn('Unauthorized attempt to delete goal', {
      userId: session?.user?.email,
      role: session?.user?.role,
    })
    return { error: 'Unauthorized' }
  }
  const { data, error } = await apiRequestWithAuth<boolean>(session, `${APIUrl}/goals/${goalId}`, {
    method: 'DELETE',
  })

  if (error) {
    logger.error('Failed to delete goal', { error })
    return {
      error:
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message: string }).message
          : String(error),
    }
  }

  if (!data) {
    return { error: 'Goal not deleted' }
  }

  return { data: true }
}
