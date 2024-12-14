'use server'

import { redirect } from 'next/navigation'

import { CheckoutRoutes, FormErrors } from '@/components/CheckoutForms/types'
import { paymentInfoSchema } from '@/schema'

export const paymentInfoFormAction = (
  prevState: FormErrors | undefined,
  formData: FormData
): FormErrors | undefined => {
  const data = Object.fromEntries(formData.entries())
  const validated = paymentInfoSchema.safeParse(data)
  if (!validated.success) {
    const errors = validated.error.issues.reduce((acc: FormErrors, issue) => {
      acc[issue.path[0]] = issue.message
      return acc
    }, {})
    return errors
  } else {
    redirect(CheckoutRoutes.REVIEW)
  }
}
