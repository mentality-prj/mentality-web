import { z } from 'zod'

export const deliveryDetailsSchema = z.object({
  fullName: z
    .string()
    .min(3, 'Name must contain at least 3 characters')
    .regex(/^[a-zA-ZÀ-ÿÀ-Ÿа-яА-ЯієїґҐ' -]+$/, "Name can contain only  letters, ', -"),
  city: z
    .string()
    .min(3, 'City must contain at least 3 characters')
    .regex(/^[a-zA-ZÀ-ÿÀ-Ÿа-яА-ЯієїґҐ' -]+$/, "City can contain only  letters, ', -"),
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
