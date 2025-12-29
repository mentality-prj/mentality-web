import { ReactNode } from 'react'

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return <section className="mt-12 flex flex-col items-center gap-10 mx-auto">{children}</section>
}

export default AuthLayout
