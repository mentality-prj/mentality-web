import { Button, Chip } from '@nextui-org/react'

import { auth } from '@/auth'
import { DeleteAllCookiesButton, SignOutButton } from '@/components'
import { CheckIcon } from '@/components/CheckIcon'
import { cookiesKeys, saveCookies } from '@/constants/cookies'
import { mockProfileData } from '@/mockApi.js'
import { CustomSession } from '@/types/auth'

export default async function ProfilePage() {
  const session = (await auth()) as CustomSession
  const data = session?.accessToken ? await mockProfileData(session?.accessToken) : null

  return (
    <div className="mt-12 flex flex-col items-center gap-10">
      {data && (
        <div className="flex w-full max-w-lg flex-col gap-5">
          <h1>Welcome, {data.name}</h1>
          <p>Your emain is: {data.email}</p>
        </div>
      )}

      {session.user?.isAIAuthorized && session.user.role && (
        // AI Area
        <div className="flex w-full max-w-lg flex-col gap-5">
          <h1 className="flex gap-1.5">
            AI user: {session.user.name}
            <sup>
              <Chip size="sm" startContent={<CheckIcon />} variant="faded" color="success">
                AI connected
              </Chip>
            </sup>
          </h1>
          <div className="flex gap-1.5">Your role is: {session.user.role}</div>
          <div className="flex gap-5">
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
          </div>
        </div>
      )}

      <SignOutButton />
    </div>
  )
}
