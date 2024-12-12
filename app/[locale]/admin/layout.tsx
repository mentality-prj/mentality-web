import { ReactNode } from 'react'

import Container from '@/components/wrappers/Container'

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return <Container>{children}</Container>
}

export default AdminLayout
