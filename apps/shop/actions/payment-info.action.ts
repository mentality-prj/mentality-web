'use server'

import { redirect } from 'next/navigation'

import { paymentInfoSchema } from '@/schema'
import { CheckoutRoutes, ErrorsMessage } from '@/types/form'

export const paymentInfoFormAction = (
  prevState: ErrorsMessage | undefined,
  formData: FormData
): ErrorsMessage | undefined => {
  const data = Object.fromEntries(formData.entries())

  const validated = paymentInfoSchema.safeParse(data)
  if (!validated.success) {
    const errors = validated.error.issues.reduce((acc: ErrorsMessage, issue) => {
      acc[issue.path[0]] = issue.message
      return acc
    }, {})
    return errors
  } else {
    redirect(CheckoutRoutes.REVIEW)
  }
}
