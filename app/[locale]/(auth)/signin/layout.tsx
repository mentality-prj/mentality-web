import { ReactNode } from 'react'

import Container from '@/components/wrappers/Container'

const ProfileLayout = ({ children }: { children: ReactNode }) => {
  return <Container>{children}</Container>
}

export default ProfileLayout
