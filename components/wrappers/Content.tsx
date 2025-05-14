import { ReactNode } from 'react'

export default function Content({ children }: { children: ReactNode }) {
  return <section className="content w-full">{children}</section>
}
