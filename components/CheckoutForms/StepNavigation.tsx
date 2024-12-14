'use client'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import path from 'path'

import { CheckoutRoutes } from './types'

const steps = [
  {
    title: 'Delivery Details',
    route: 'delivery-details',
    link: CheckoutRoutes.DELIVERY_DETAILS,
  },
  {
    title: 'Payment Info',
    route: 'payment-info',
    link: CheckoutRoutes.PAYMENT_INFO,
  },

  { title: 'Review', route: 'review', link: CheckoutRoutes.REVIEW },
]

export default function StepNavigation() {
  const pathname = usePathname()
  const currentPath = path.basename(pathname)

  return (
    <div className="mb-12 mt-4 min-w-60 lg:mb-0">
      {/* list of form steps */}
      <div className="relative flex flex-row justify-between lg:flex-col lg:justify-start lg:gap-8">
        {steps.map((step, i) => (
          <Link
            href={step.link}
            key={step.link}
            className="group z-20 flex items-center gap-3 text-2xl"
            prefetch={true}
          >
            <span
              className={clsx(
                'flex h-10 w-10 items-center justify-center rounded-full border text-sm transition-colors duration-200 lg:h-12 lg:w-12 lg:text-lg',
                {
                  'border-none bg-teal-500 text-black group-hover:border-none group-hover:text-black':
                    currentPath === step.route,
                  'border-white/75 bg-gray-900 text-white/75 group-hover:border-white group-hover:text-white':
                    currentPath !== step.route,
                }
              )}
            >
              {i + 1}
            </span>
            <span
              className={clsx('hidden text-white/75 transition-colors duration-200 group-hover:text-white lg:block', {
                'font-light': currentPath !== step.route,
                'font-semibold text-white': currentPath === step.route,
              })}
            >
              {step.title}
            </span>
          </Link>
        ))}
        {/* mobile background dashes */}
        <div className="absolute top-4 flex h-1 w-full border-b border-dashed lg:hidden" />
      </div>
    </div>
  )
}
