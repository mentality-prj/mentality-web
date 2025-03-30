import { redirect } from 'next/navigation'

import { Routes } from '@/constants/routes'
import { Texts } from '@/constants/texts'
import { Button } from '@/ds/shadcn/button'

export default function GoToLoginPageButton() {
  return (
    <form
      action={() => {
        redirect(Routes.SIGNIN)
      }}
    >
      <Button type="submit">{Texts.LOGIN}</Button>
    </form>
  )
}
