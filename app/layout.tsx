import { ReactNode } from 'react'

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  // html/body are rendered by app/[locale]/layout.tsx
  return <>{children}</>
}
