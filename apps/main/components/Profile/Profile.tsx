import { CardBody, CardFooter, Chip, Divider } from '@nextui-org/react'

import { CheckIcon } from '@/components/icons/check-icon'
import { RoleType } from '@/types/security'

export default function Profile({ role }: { role: RoleType }) {
  return (
    <>
      <Divider />
      <CardBody>
        <p>{role}</p>
      </CardBody>
      <Divider />
      <CardFooter>
        <Chip size="sm" startContent={<CheckIcon />} variant="faded" color="success">
          AI connected
        </Chip>
      </CardFooter>
    </>
  )
}
