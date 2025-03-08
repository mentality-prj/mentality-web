import { CookiesKeys, saveCookies } from '@/actions/cookies.actions'
import { Button } from '@/ds/shadcn/button'

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
      <Button variant="secondary" type="submit">
        Add Data to Cookies
      </Button>
    </form>
  )
}
