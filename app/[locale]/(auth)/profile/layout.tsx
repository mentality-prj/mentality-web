import { ReactNode } from 'react'

import ProfileSidebar from '@/components/Profile/Sidebar'

const ProfileLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex">
      <ProfileSidebar />
      {children}
    </main>
  )
}

export default ProfileLayout
