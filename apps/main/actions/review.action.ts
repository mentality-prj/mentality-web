'use server'

import { deliveryDetailsSchema, NewCheckout, paymentInfoSchema } from '@/schema'
import { CheckoutRoutes } from '@/types/form'

export type SubmitCheckoutReturnType = {
  redirect?: CheckoutRoutes
  errorMsg?: string
  success?: boolean
}

export const reviewFormAction = async (checkout: NewCheckout): Promise<SubmitCheckoutReturnType> => {
  const deliveryDetailsValidated = deliveryDetailsSchema.safeParse(checkout)
  if (!deliveryDetailsValidated.success) {
    return {
      redirect: CheckoutRoutes.DELIVERY_DETAILS,
      errorMsg: 'Please validate delivery details',
    }
  }

  const paymentInfoSchemaValidated = paymentInfoSchema.safeParse(checkout)
  if (!paymentInfoSchemaValidated.success) {
    return {
      redirect: CheckoutRoutes.PAYMENT_INFO,
      errorMsg: 'Please validate payment info',
    }
  }

  return {
    success: true,
    redirect: CheckoutRoutes.THANKS,
  }
}
