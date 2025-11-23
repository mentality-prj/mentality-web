import axios from 'axios'

import { getAuthHeaders } from '@/actions/getAuthHeaders'
import { APIUrl } from '@/requests/config'

export async function getUserNotes() {
  const headers = await getAuthHeaders()
  try {
    // change to the correct url
    // const response = await axios.get(`${APIUrl}/diary/user`, {
    // and change types in related files
    const response = await axios.get(`${APIUrl}/tags`, { headers })
    return response.data ?? []
  } catch (err) {
    throw err
  }
}
