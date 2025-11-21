import axios from 'axios'

import { auth } from '@/auth'
import { APIUrl } from '@/requests/config'

export async function getUserNotes() {
  const session = await auth()
  const token = session?.OAuthToken
  console.log('---SESSION---:', session)
  console.log('---TOKEN---:', token)

  try {
    // change to the correct url
    // const response = await axios.get(`${APIUrl}/diary/user`, {
    // and change types in related files
    const response = await axios.get(`${APIUrl}/tags`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log('---RESPONSE DATA---:', response.data, typeof response.data)
    return response.data ?? []
  } catch (err) {
    console.log('---AXIOS ERROR---:', err)
    throw err
  }
}
