import { ReactNode } from 'react'

import Container from '@/components/wrappers/Container'

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Container>
      <section className="mt-12 flex flex-col items-center gap-10">{children}</section>
    </Container>
  )
}

export default AuthLayout
