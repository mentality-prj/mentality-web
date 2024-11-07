import axios from 'axios'

import { auth, CustomSession } from '@/auth'
import { SignOut } from '@/components/signout-button'
import { mockProfileData } from '@/mockApi.js'

export default async function ProfilePage() {
  const session = (await auth()) as CustomSession
  const data = session?.accessToken ? await mockProfileData(session?.accessToken) : null

  const sendTokenToBackend = async () => {
    'use server'
    console.log('session', session)

    if (session?.idToken) {
      try {
        const response = await axios.post('http://localhost:3200/api/auth/validate-token', {
          token: session.idToken,
          provider: session.provider,
        })
        console.log('User data from backend:', response.data)
      } catch (error) {
        console.error('Error validating token:', error)
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-10">
      {data && (
        <div className="flex flex-col gap-5">
          <div className="">{data.name}</div>
          <div className="">{data.email}</div>
        </div>
      )}

      {session && (
        <form action={sendTokenToBackend}>
          <button type="submit">Validate Token</button>
        </form>
      )}
      <SignOut />
    </div>
  )
}
