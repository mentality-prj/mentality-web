import { Button } from '@nextui-org/react'

import { auth } from '@/auth'
import { DeleteAllCookiesButton, SignOutButton } from '@/components'
import { cookiesKeys, saveCookies } from '@/constants/cookies'
import { mockProfileData } from '@/mockApi.js'
import { CustomSession } from '@/types/auth'

export default async function ProfilePage() {
  const session = (await auth()) as CustomSession
  const data = session?.accessToken ? await mockProfileData(session?.accessToken) : null

  return (
    <div className="flex flex-col items-center gap-10">
      {data && (
        <div className="flex flex-col gap-5">
          <h1>Welcome, {data.name}</h1>
          <p>Your emain is: {data.email}</p>
          {session && session.user && <p>Your role is: {session.user.role}</p>}
        </div>
      )}
      <form
        action={async () => {
          'use server'
          saveCookies([
            { [cookiesKeys.UserName]: data.name },
            { [cookiesKeys.UserEmail]: data.email },
            { [cookiesKeys.UserRole]: session?.user?.role || 'user' },
          ])
        }}
      >
        <Button color="secondary" type="submit">
          Add Data to Cookies
        </Button>
      </form>

      <DeleteAllCookiesButton />

      <SignOutButton />
    </div>
  )
}
