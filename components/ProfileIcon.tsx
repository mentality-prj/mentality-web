import { User2 } from 'lucide-react'
import Link from 'next/link'

export function ProfileIcon() {
  return (
    <Link
      href="/profile"
      aria-label="Profile"
      className="flex items-center justify-center rounded-full p-2 hover:bg-gray-100"
    >
      <User2 className="h-6 w-6 text-[var(--title-color)]" />
    </Link>
  )
}
