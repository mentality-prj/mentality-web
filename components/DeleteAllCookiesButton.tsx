import { Button } from '@nextui-org/react'

import { clearAllCookies } from '@/constants/cookies'

function DeleteAllCookiesButton() {
  return (
    <form
      action={async () => {
        'use server'
        clearAllCookies()
      }}
    >
      <Button color="primary" type="submit">
        Clear All Cookies
      </Button>
    </form>
  )
}

export default DeleteAllCookiesButton
