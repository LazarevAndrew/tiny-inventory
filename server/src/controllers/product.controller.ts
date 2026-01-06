
import { Request, Response, NextFunction } from 'express'
import * as service from '../services/product.service'
import { productCreateSchema, productUpdateSchema } from '../validations/product.schema'

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt((req.query.page as string) || '1', 10)
    const pageSize = parseInt((req.query.pageSize as string) || '10', 10)
    const filters = {
      storeId: req.query.storeId ? parseInt(req.query.storeId as string, 10) : undefined,
      category: (req.query.category as string) || undefined,
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
      minQty: req.query.minQty ? parseInt(req.query.minQty as string, 10) : undefined,
      maxQty: req.query.maxQty ? parseInt(req.query.maxQty as string, 10) : undefined,
      search: (req.query.search as string) || undefined,
    }
    const sortBy = (req.query.sortBy as string) || undefined
    const sortOrder = (req.query.sortOrder as string) as 'asc'|'desc' | undefined
    const result = await service.list(page, pageSize, filters, sortBy, sortOrder)
    res.json(result)
  } catch (err) { next(err) }
}

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10)
    const product = await service.get(id)
    if (!product) return res.status(404).json({ error: { message: 'Product not found' } })
    res.json(product)
  } catch (err) { next(err) }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = productCreateSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: { message: 'Validation failed', details: parsed.error.format() } })
    const product = await service.create({
      name: parsed.data.name,
      category: parsed.data.category,
      price: parsed.data.price,
      quantity: parsed.data.quantity,
      sku: parsed.data.sku,
      store: { connect: { id: parsed.data.storeId } },
    })
    res.status(201).json(product)
  } catch (err) { next(err) }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10)
    const parsed = productUpdateSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: { message: 'Validation failed', details: parsed.error.format() } })
    const data: any = {}
    if (parsed.data.name) data.name = parsed.data.name
    if (parsed.data.category) data.category = parsed.data.category
    if (parsed.data.price !== undefined) data.price = parsed.data.price
    if (parsed.data.quantity !== undefined) data.quantity = parsed.data.quantity
    if (parsed.data.sku) data.sku = parsed.data.sku
    if (parsed.data.storeId) data.store = { connect: { id: parsed.data.storeId } }
    const product = await service.update(id, data)
    res.json(product)
  } catch (err) { next(err) }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10)
    await service.remove(id)
    res.status(204).send()
  } catch (err) { next(err) }
}
