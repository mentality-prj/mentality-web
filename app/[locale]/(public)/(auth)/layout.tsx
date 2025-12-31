import { ReactNode } from 'react'

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return <section className="mx-auto mt-12 flex flex-col items-center gap-10">{children}</section>
}

export default AuthLayout
