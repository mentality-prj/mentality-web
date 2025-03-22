export type ErrorsMessage = {
  [key: string]: string | undefined
}

export enum CheckoutRoutes {
  DELIVERY_DETAILS = '/shop/delivery-details',
  PAYMENT_INFO = '/shop/payment-info',
  REVIEW = '/shop/review',
  THANKS = '/thanks',
}
