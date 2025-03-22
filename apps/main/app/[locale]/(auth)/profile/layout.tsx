import { ReactNode } from 'react'

import { SignOutButton } from '@/components/Buttons'

const ProfileLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {children}
      <SignOutButton />
    </>
  )
}

export default ProfileLayout
