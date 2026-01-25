import axios from 'axios'

import { getAuthHeaders } from '@/actions/getAuthHeaders'
import { APIUrl } from '@/requests/config'

export interface PersonalGoal {
  userId: string
  id: string
  text: string
  check: number
  repeat: number
  status: 'pending' | 'completed' | 'in progress'
}

export async function fetchPersonalGoals(): Promise<PersonalGoal[]> {
  const headers = await getAuthHeaders()
  const response = await axios.get<PersonalGoal[]>(`${APIUrl}/goals`, { headers })
  return response.data || []
}

export async function updatePersonalGoal({ id, check }: Pick<PersonalGoal, 'id' | 'check'>): Promise<PersonalGoal> {
  try {
    const headers = await getAuthHeaders()
    const response = await axios.patch<PersonalGoal>(`${APIUrl}/goals/${id}`, { check: check + 1 }, { headers })
    return response.data
  } catch (error) {
    console.error('Failed to update goal:', error)
    throw error
  }
}

export async function resetPersonalGoal({ id }: Pick<PersonalGoal, 'id'>): Promise<PersonalGoal> {
  try {
    const headers = await getAuthHeaders()
    const response = await axios.patch<PersonalGoal>(`${APIUrl}/goals/${id}`, { check: 0 }, { headers })
    return response.data
  } catch (error) {
    console.error('Failed to update goal:', error)
    throw error
  }
}

export async function deletePersonalGoal({ id }: Pick<PersonalGoal, 'id'>): Promise<void> {
  try {
    const headers = await getAuthHeaders()
    await axios.delete<void>(`${APIUrl}/goals/${id}`, { headers })
  } catch (error) {
    console.error('Failed to delete goal:', error)
    throw error
  }
}

export async function createPersonalGoal({ text, repeat }: Pick<PersonalGoal, 'repeat' | 'text'>) {
  try {
    const headers = await getAuthHeaders()
    const response = await axios.post<PersonalGoal>(
      `${APIUrl}/goals`,
      {
        text,
        repeat,
      },
      { headers }
    )
    return response.data
  } catch (error) {
    console.error('Failed to create goal:', error)
    throw error
  }
}
