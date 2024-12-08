import { Button } from '@nextui-org/react'
import { redirect } from 'next/navigation'

import { Routes } from '@/constants/routes'
import { Texts } from '@/constants/texts'

export default function GoToLoginPageButton() {
  return (
    <form
      action={() => {
        redirect(Routes.SIGNIN)
      }}
    >
      <Button color="primary" type="submit">
        {Texts.LOGIN}
      </Button>
    </form>
  )
}
