import { ReactNode } from 'react'

import '@/styles/globals.css'

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  // html/body are rendered by app/[locale]/layout.tsx
  return <>{children}</>
}
