import { ReactNode } from 'react'

import { SignOutButton } from '@/components/shared/Buttons'

const ProfileLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {children}
      <SignOutButton />
    </>
  )
}

export default ProfileLayout
