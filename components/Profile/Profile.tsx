import { Divider } from '@nextui-org/react'

import { CheckIcon } from '@/components/icons/check-icon'
import { Badge } from '@/ds/shadcn/badge'
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
        <Badge variant="outline" color="success">
          <CheckIcon /> AI connected
        </Badge>
      </CardFooter>
    </>
  )
}
