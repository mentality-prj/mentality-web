import axios from 'axios'

import { getAuthHeaders } from '@/actions/getAuthHeaders'
import { APIUrl } from '@/requests/config'
import { MeditationData } from '@/types/myGuige'

export async function getMeditations(): Promise<MeditationData[]> {
  const headers = await getAuthHeaders()

  try {
    const response = await axios.get(`${APIUrl}/exercises`, { headers })
    return response.data.data ?? []
  } catch (err) {
    throw err
  }
}
