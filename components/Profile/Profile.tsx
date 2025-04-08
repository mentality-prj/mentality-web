import { Chip, Divider } from '@nextui-org/react'

import { CheckIcon } from '@/components/icons/check-icon'
import { CardContent, CardFooter } from '@/ds/shadcn/card'
import { RoleType } from '@/types/security'

export default function Profile({ role }: { role: RoleType }) {
  return (
    <>
      <Divider />
      <CardContent>
        <p>{role}</p>
      </CardContent>
      <Divider />
      <CardFooter>
        <Chip size="sm" startContent={<CheckIcon />} variant="faded" color="success">
          AI connected
        </Chip>
      </CardFooter>
    </>
  )
}
