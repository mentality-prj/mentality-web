'use server'
import axios from 'axios'

import { APIUrl } from '@/requests/config'

interface PersonalGoal {
  userId: string
  id: string
  text: string
  check: number
  repeat: number
  status: 'pending' | 'completed'
}

export async function fetchPersonalGoals(userId: string): Promise<PersonalGoal[]> {
  const response = await axios.get<PersonalGoal[]>(`${APIUrl}/goals/${userId}`)
  return response.data || []
}

export async function updatePersonalGoal({
  id,
  userId,
  check,
}: Pick<PersonalGoal, 'id' | 'userId' | 'check'>): Promise<PersonalGoal> {
  try {
    const response = await axios.patch<PersonalGoal>(`${APIUrl}/goals/${id}/${userId}`, {
      check: check + 1,
    })
    return response.data
  } catch (error) {
    console.error('Failed to update goal:', error)
    throw error
  }
}

export async function resetPersonalGoal({ id, userId }: Pick<PersonalGoal, 'id' | 'userId'>): Promise<PersonalGoal> {
  try {
    const response = await axios.patch<PersonalGoal>(`${APIUrl}/goals/${id}/${userId}`, {
      check: 0,
    })
    return response.data
  } catch (error) {
    console.error('Failed to update goal:', error)
    throw error
  }
}

export async function deletePersonalGoal({ id, userId }: Pick<PersonalGoal, 'id' | 'userId'>): Promise<void> {
  try {
    await axios.delete<void>(`${APIUrl}/goals/${id}/${userId}`)
  } catch (error) {
    console.error('Failed to delete goal:', error)
    throw error
  }
}

export async function createPersonalGoal({ userId, text, repeat }: Pick<PersonalGoal, 'repeat' | 'userId' | 'text'>) {
  try {
    const response = await axios.post<PersonalGoal>(`${APIUrl}/goals/${userId}`, {
      userId,
      repeat,
      text,
    })
    return response.data
  } catch (error) {
    console.error('Failed to create goal:', error)
    throw error
  }
}
