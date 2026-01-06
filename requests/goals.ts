import { logger } from '@/lib/logger'
import { CreateGoalDto, GoalEntity, UpdateGoalDto } from '@/types/api-responses'
import { CustomSession } from '@/types/auth'

import { APIUrl } from './config'
import { performAuthRequest } from './genericFetch'

export async function createGoal(session: CustomSession | null, dto: CreateGoalDto) {
  const res = await performAuthRequest<GoalEntity>(session, `${APIUrl}/goals`, { method: 'POST', body: dto })
  if ('error' in res) {
    logger.error('Failed to create goal', { error: res.error })
    return { error: res.error }
  }
  return { data: res.data }
}

export async function getGoals(session: CustomSession | null) {
  const res = await performAuthRequest<GoalEntity[]>(session, `${APIUrl}/goals`, { method: 'GET' })
  if ('error' in res) return { error: res.error }
  return { data: res.data }
}

export async function updateGoal(session: CustomSession | null, id: string, dto: UpdateGoalDto) {
  const res = await performAuthRequest<GoalEntity>(session, `${APIUrl}/goals/${id}`, { method: 'PATCH', body: dto })
  if ('error' in res) return { error: res.error }
  return { data: res.data }
}

export async function deleteGoal(session: CustomSession | null, id: string) {
  const res = await performAuthRequest<boolean>(session, `${APIUrl}/goals/${id}`, { method: 'DELETE' })
  if ('error' in res) return { error: res.error }
  return { data: res.data }
}
