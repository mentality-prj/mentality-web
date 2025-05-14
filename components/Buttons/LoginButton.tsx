import { redirect } from 'next/navigation'

import { Routes } from '@/constants/routes'
import { LoginIcon } from '@/ds/icons/login'

export default function LoginButton() {
  return (
    <form
      action={() => {
        redirect(Routes.SIGNIN)
      }}
    >
      <button
        className="flex gap-2 px-4 py-2 group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:py-0"
        type="submit"
      >
        <LoginIcon />
        <span className="group-data-[collapsible=icon]:hidden">Login</span>
      </button>
    </form>
  )
}
