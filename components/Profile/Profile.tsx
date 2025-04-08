import { CheckIcon } from '@/components/icons/check-icon'
import { Badge } from '@/ds/shadcn/badge'
import { CardContent, CardFooter } from '@/ds/shadcn/card'
import { Separator } from '@/ds/shadcn/separator'
import { RoleType } from '@/types/security'

export default function Profile({ role }: { role: RoleType }) {
  return (
    <>
      <Separator />
      <CardContent>
        <p>{role}</p>
      </CardContent>
      <Separator />
      <CardFooter>
        <Badge variant="outline" color="success">
          <CheckIcon /> AI connected
        </Badge>
      </CardFooter>
    </>
  )
}
