import { GoalEntity } from '@/types/api-responses'
import { CustomSession } from '@/types/auth'
import type { GoalCategory } from '@/types/goals'

import { APIUrl } from './config'
import { performAuthRequest } from './genericFetch'

export async function fetchPersonalGoals(
  session: CustomSession | null
): Promise<{ data?: GoalEntity[]; error?: string }> {
  const res = await performAuthRequest<GoalEntity[]>(session, `${APIUrl}/goals`, { method: 'GET' })
  return 'error' in res ? { error: res.error } : { data: res.data ?? [] }
}

export async function createPersonalGoal(
  session: CustomSession | null,
  {
    text,
    repeat,
    deadline,
    category,
  }: Pick<GoalEntity, 'text' | 'repeat'> & { deadline?: string; category: GoalCategory }
): Promise<{ data?: GoalEntity; error?: string }> {
  const res = await performAuthRequest<GoalEntity>(session, `${APIUrl}/goals`, {
    method: 'POST',
    body: { text, repeat, category, ...(deadline ? { deadline } : {}) },
  })
  return 'error' in res ? { error: res.error } : { data: res.data }
}

export async function updatePersonalGoal(
  session: CustomSession | null,
  { id, check }: Pick<GoalEntity, 'id' | 'check'>
): Promise<{ data?: GoalEntity; error?: string }> {
  const res = await performAuthRequest<GoalEntity>(session, `${APIUrl}/goals/${id}`, {
    method: 'PATCH',
    body: { check: check + 1 },
  })
  return 'error' in res ? { error: res.error } : { data: res.data }
}

export async function resetPersonalGoal(
  session: CustomSession | null,
  { id }: Pick<GoalEntity, 'id'>
): Promise<{ data?: GoalEntity; error?: string }> {
  const res = await performAuthRequest<GoalEntity>(session, `${APIUrl}/goals/${id}`, {
    method: 'PATCH',
    body: { check: 0 },
  })
  return 'error' in res ? { error: res.error } : { data: res.data }
}

export async function deletePersonalGoal(
  session: CustomSession | null,
  { id }: Pick<GoalEntity, 'id'>
): Promise<{ error?: string }> {
  const res = await performAuthRequest<void>(session, `${APIUrl}/goals/${id}`, { method: 'DELETE' })
  return 'error' in res ? { error: res.error } : {}
}
