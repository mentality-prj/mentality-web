import { CustomSession } from '@/types/auth'
import { GoalStatus } from '@/types/goals'

import { APIUrl } from './config'
import { performAuthRequest } from './genericFetch'

export interface PersonalGoal {
  userId: string
  id: string
  text: string
  check: number
  repeat: number
  status: GoalStatus
  createdAt?: string
  updatedAt?: string
}

export async function fetchPersonalGoals(
  session: CustomSession | null
): Promise<{ data?: PersonalGoal[]; error?: string }> {
  const res = await performAuthRequest<PersonalGoal[]>(session, `${APIUrl}/goals`, { method: 'GET' })
  return 'error' in res ? { error: res.error } : { data: res.data ?? [] }
}

export async function createPersonalGoal(
  session: CustomSession | null,
  { text, repeat }: Pick<PersonalGoal, 'text' | 'repeat'>
): Promise<{ data?: PersonalGoal; error?: string }> {
  const res = await performAuthRequest<PersonalGoal>(session, `${APIUrl}/goals`, {
    method: 'POST',
    body: { text, repeat },
  })
  return 'error' in res ? { error: res.error } : { data: res.data }
}

export async function updatePersonalGoal(
  session: CustomSession | null,
  { id, check }: Pick<PersonalGoal, 'id' | 'check'>
): Promise<{ data?: PersonalGoal; error?: string }> {
  const res = await performAuthRequest<PersonalGoal>(session, `${APIUrl}/goals/${id}`, {
    method: 'PATCH',
    body: { check: check + 1 },
  })
  return 'error' in res ? { error: res.error } : { data: res.data }
}

export async function resetPersonalGoal(
  session: CustomSession | null,
  { id }: Pick<PersonalGoal, 'id'>
): Promise<{ data?: PersonalGoal; error?: string }> {
  const res = await performAuthRequest<PersonalGoal>(session, `${APIUrl}/goals/${id}`, {
    method: 'PATCH',
    body: { check: 0 },
  })
  return 'error' in res ? { error: res.error } : { data: res.data }
}

export async function deletePersonalGoal(
  session: CustomSession | null,
  { id }: Pick<PersonalGoal, 'id'>
): Promise<{ error?: string }> {
  const res = await performAuthRequest<void>(session, `${APIUrl}/goals/${id}`, { method: 'DELETE' })
  return 'error' in res ? { error: res.error } : {}
}
