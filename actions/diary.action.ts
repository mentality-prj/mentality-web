import axios from 'axios'

import { getAuthHeaders } from '@/actions/getAuthHeaders'
import { APIUrl } from '@/requests/config'

export type DiaryEntryPayload = {
  content: string
  tags: string[]
}

export async function createDiaryNote({ content, tags }: DiaryEntryPayload) {
  const headers = await getAuthHeaders()
  try {
    const response = await axios.post(`${APIUrl}/diary`, { content, tags }, { headers })
    return response.data
  } catch (error) {
    throw error
  }
}

export async function fetchDiaryNote(): Promise<DiaryEntryPayload[]> {
  const headers = await getAuthHeaders()
  try {
    const response = await axios.get<DiaryEntryPayload[]>(`${APIUrl}/goals`, {
      headers,
    })
    return response.data || []
  } catch (err) {
    throw err
  }
}
