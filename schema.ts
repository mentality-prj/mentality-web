import { z } from 'zod'

const currentDate = new Date()
const currentMonth = currentDate.getMonth() + 1
const currentYear = currentDate.getFullYear() % 100

export const deliveryDetailsSchema = z.object({
  fullName: z
    .string()
    .min(3, 'Name must contain at least 3 characters')
    .regex(/^[a-zA-ZÀ-ÿÀ-Ÿа-яА-ЯієїґҐ' -]+$/, "Name can contain only  letters, ', -"),
  city: z
    .string()
    .min(3, 'City must contain at least 3 characters')
    .regex(/^[a-zA-ZÀ-ÿÀ-Ÿа-яА-ЯієїґҐ' -,.]+$/, "City can contain only  letters, ', -"),
  deliveryMethod: z.string().nonempty(),
  deliveryDate: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])-\d{2}$/, 'Invalid date format'),
})

export const paymentInfoSchema = z.object({
  cardNumber: z.string().refine((value) => value.length === 19, {
    message: 'Card number must be exactly 16 characters long',
  }),
  expirationDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Invalid date format')
    .refine((val) => {
      const [month, year] = val.split('/').map(Number)
      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        return false
      }
      return true
    }, 'Card is expired'),
  cvv: z.string().refine((value) => value.length === 3, {
    message: 'The CVV must contain exactly 3 characters',
  }),
})

export const newCheckoutSchema = z.object({
  ...deliveryDetailsSchema.shape,
  ...paymentInfoSchema.shape,
})

export type NewCheckout = z.infer<typeof newCheckoutSchema>

export const newCheckoutInitialValuesSchema = z.object({
  cardNumber: z.string().optional(),
  city: z.string().optional(),
  cvv: z.string().optional(),
  deliveryDate: z.string().optional(),
  deliveryMethod: z.string().optional(),
  expirationDate: z.string().optional(),
  fullName: z.string().optional(),
})

export type newCheckoutInitialValuesType = z.infer<typeof newCheckoutInitialValuesSchema>
