
import { z } from 'zod'
export const productCreateSchema = z.object({
  name: z.string().min(2),
  category: z.string().min(2),
  price: z.number().nonnegative(),
  quantity: z.number().int().nonnegative(),
  sku: z.string().min(3),
  storeId: z.number().int().positive(),
})
export const productUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  category: z.string().min(2).optional(),
  price: z.number().nonnegative().optional(),
  quantity: z.number().int().nonnegative().optional(),
  sku: z.string().min(3).optional(),
  storeId: z.number().int().positive().optional(),
}).refine((data) => Object.keys(data).length > 0, { message: 'At least one field must be provided.' })
