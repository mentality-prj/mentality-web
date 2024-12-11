import { ReactNode } from 'react'

import Container from '@/components/Container'

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return <Container>{children}</Container>
}

export default AdminLayout
