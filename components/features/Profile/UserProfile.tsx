import Image from 'next/image'

interface UserProfileProps {
  name: string
  email: string | null | undefined
  image: string | null | undefined
}
export default function UserProfile({ name, email, image }: UserProfileProps) {
  return (
    <div className="flex gap-xs">
      {image && <Image alt={name} height={40} className="rounded-[8px]" src={image} width={40} />}
      <div className="flex flex-col">
        <p className="text-md">{name}</p>
        <p className="text-small text-default-500">{email}</p>
      </div>
    </div>
  )
}
