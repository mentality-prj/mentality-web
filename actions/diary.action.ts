import axios from 'axios'

import { APIUrl } from '@/requests/config'

export type DiaryEntryPayload = {
  content: string
  tags: string[]
}

export async function createDiaryNote({ content, tags }: DiaryEntryPayload) {
  try {
    const response = await axios.post(`${APIUrl}/diary`, { content, tags })
    return response.data
  } catch (error) {
    console.error('createDiaryNote error:', error)
    throw error
  }
}
