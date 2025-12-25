import { CheckIcon } from '@/ds/icons/check'
import { Badge } from '@/ds/shadcn/badge'
import { Separator } from '@/ds/shadcn/separator'
import { RoleType } from '@/types/security'

export default function Profile({ role }: { role: RoleType }) {
  return (
    <>
      <Separator />
      <div>
        <p>{role}</p>
      </div>
      <Separator />
      <div>
        <Badge variant="outline" color="success">
          <CheckIcon /> AI connected
        </Badge>
      </div>
    </>
  )
}
