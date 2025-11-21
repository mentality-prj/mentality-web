import axios from 'axios'

import { auth } from '@/auth'
import { APIUrl } from '@/requests/config'

export type DiaryEntryPayload = {
  content: string
  tags: string[]
}

export async function createDiaryNote({ content, tags }: DiaryEntryPayload) {
  const session = await auth()
  const token = session?.OAuthToken
  console.log('fetchPersonalGoals SESSION:', session)
  console.log('fetchPersonalGoals TOKEN:', token)

  try {
    const response = await axios.post(
      `${APIUrl}/diary`,
      { content, tags },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    console.log()
    return response.data
  } catch (error) {
    console.error('createDiaryNote error:', error)
    console.log('fetchPersonalGoals SESSION:', session)
    console.log('fetchPersonalGoals TOKEN:', token)

    throw error
  }
}

export async function fetchDiaryNote(): Promise<DiaryEntryPayload[]> {
  const session = await auth()
  const token = session?.OAuthToken
  console.log('fetchPersonalGoals SESSION:', session)
  console.log('fetchPersonalGoals TOKEN:', token)
  const response = await axios.get<DiaryEntryPayload[]>(`${APIUrl}/goals`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data || []
}
