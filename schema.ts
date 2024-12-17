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
  deliveryMethod: z.string(),
  deliveryDate: z.string().min(3, 'Name must be at least 3 characters long'),
})

export const paymentInfoSchema = z.object({
  cardNumber: z.string().refine((value) => value.length === 19, {
    message: 'The card number must contain exactly 16 characters',
  }),

  expirationDate: z.string().min(3, 'Name must be at least 3 characters long'),
  cvv: z.string().refine((value) => value.length === 3, {
    message: 'The cvv must contain exactly 3 characters',
  }),
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
