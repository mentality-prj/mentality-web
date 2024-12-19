'use server'

import { redirect } from 'next/navigation'

import { deliveryDetailsSchema } from '@/schema'
import { CheckoutRoutes, FormErrors } from '@/types/form'

export const deliveryDetailsFormAction = (
  prevState: FormErrors | undefined,
  formData: FormData
): FormErrors | undefined => {
  const data = Object.fromEntries(formData.entries())
  const validated = deliveryDetailsSchema.safeParse(data)

  if (!validated.success) {
    const errors = validated.error.issues.reduce((acc: FormErrors, issue) => {
      acc[issue.path[0]] = issue.message
      return acc
    }, {})
    return errors
  } else {
    redirect(CheckoutRoutes.PAYMENT_INFO)
  }
}
