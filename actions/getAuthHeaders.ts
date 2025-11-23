import { auth } from '@/auth'

export async function getAuthHeaders() {
  const session = await auth()
  const token = session?.OAuthToken

  return { Authorization: `Bearer ${token}` }
}
