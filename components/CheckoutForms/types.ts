export interface FormErrors {
  [key: string]: string | undefined
}

export enum CheckoutRoutes {
  DELIVERY_DETAILS = '/delivery-details',
  PAYMENT_INFO = '/payment-info',
  REVIEW = '/review',
}
