import { z } from 'zod'

export const deliveryDetailsSchema = z.object({
  fullName: z.string().min(3, 'Name must be at least 3 characters long'),
  city: z.string().min(3, 'Name must be at least 3 characters long'),
  deliveryMethod: z.string().min(3, 'Name must be at least 3 characters long'),
  deliveryDate: z.string().min(3, 'Name must be at least 3 characters long'),
})

export const paymentInfoSchema = z.object({
  cardNumber: z.string().min(16, 'Card Number must be at least 16 characters long'),
  expirationDate: z.string().min(3, 'Name must be at least 3 characters long'),
  cvv: z.string().min(3, 'Name must be at least 3 characters long'),
})

export const newCheckoutSchema = z.object({
  ...deliveryDetailsSchema.shape,
  ...paymentInfoSchema.shape,
})

export type NewCheckout = z.infer<typeof newCheckoutSchema>

export const newCheckoutInitialValuesSchema = z.object({
  fullName: z.string().optional(),
  city: z.string().optional(),
  deliveryMethod: z.string().optional(),
  deliveryDate: z.string().optional(),
  cardNumber: z.string().optional(),
  expirationDate: z.string().optional(),
  cvv: z.string().optional(),
})

export type newCheckoutInitialValuesType = z.infer<typeof newCheckoutInitialValuesSchema>
