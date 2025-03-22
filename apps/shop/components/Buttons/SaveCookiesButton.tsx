import { Button } from '@nextui-org/react'

import { CookiesKeys, saveCookies } from '@/actions/cookies.actions'

export default function SaveCookiesButton() {
  return (
    <form
      action={async () => {
        'use server'
        saveCookies([
          { [CookiesKeys.UserName]: 'Name' },
          { [CookiesKeys.UserEmail]: 'email' },
          { [CookiesKeys.UserRole]: 'user' },
        ])
      }}
    >
      <Button color="secondary" type="submit">
        Add Data to Cookies
      </Button>
    </form>
  )
}
