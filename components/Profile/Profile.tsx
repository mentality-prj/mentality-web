import { CheckIcon } from '@/ds/icons/check'
import { RoleType } from '@/types/security'
import { Badge } from '@/ui/badge'
import { Separator } from '@/ui/separator'

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
