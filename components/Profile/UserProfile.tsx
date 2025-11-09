import Image from 'next/image'

import DefaultProfileImage from '@/assets/default-profile.png'
import { CardHeader } from '@/ds/shadcn/card'

interface UserProfileProps {
  name: string
  email: string | null | undefined
  image: string | null | undefined
}
export default function UserProfile({ name, email, image }: UserProfileProps) {
  return (
    <>
      <CardHeader className="flex gap-3">
        <Image alt={name} height={40} className="rounded-[8px]" src={image ?? DefaultProfileImage} width={40} />
        <div className="flex flex-col">
          <p className="text-md">{name}</p>
          <p className="text-small text-default-500">{email}</p>
        </div>
      </CardHeader>
    </>
  )
}
