import Link from 'next/link'

import { Routes } from '@/constants/routes'

export default function ThanksPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-4 text-center text-3xl">Thanks for your order</div>
      <Link className="w-[120px] rounded-lg border-1 text-center" href={Routes.MAIN}>
        Back to home
      </Link>
    </div>
  )
}
