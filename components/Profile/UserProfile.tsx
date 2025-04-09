import Image from 'next/image'

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
        <Image
          alt={name}
          height={40}
          className="rounded-[8px]"
          src={image || 'https://avatars.githubusercontent.com/u/86160567?s=200&v=4'}
          width={40}
        />
        <div className="flex flex-col">
          <p className="text-md">{name}</p>
          <p className="text-small text-default-500">{email}</p>
        </div>
      </CardHeader>
    </>
  )
}
