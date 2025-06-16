import React from 'react'

import StepNavigation from '@/components/CheckoutForms/StepNavigation'
import { AddCheckoutContextProvider } from '@/context/addCheckoutContext'

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2 lg:px-0">
      <div className="mb-28 mt-20 flex flex-col gap-x-16 lg:flex-row">
        <StepNavigation />
        <AddCheckoutContextProvider>
          <div className="w-full">{children}</div>
        </AddCheckoutContextProvider>
      </div>
    </div>
  )
}
