import type { Prisma } from '@prisma/client'
import prisma from '../db/prisma'

export interface ProductFilters {
  storeId?: number
  category?: string
  minPrice?: number
  maxPrice?: number
  minQty?: number
  maxQty?: number
  search?: string
}

export async function listProducts(
  page: number,
  pageSize: number,
  filters: ProductFilters,
  sortBy: keyof Prisma.ProductOrderByWithRelationInput = 'name',
  sortOrder: 'asc' | 'desc' = 'asc',
) {
  const where: Prisma.ProductWhereInput = {}
  if (filters.storeId)
    where.storeId = filters.storeId
  if (filters.category)
    where.category = { equals: filters.category, mode: 'insensitive' as any }
  if (filters.minPrice || filters.maxPrice)
    where.price = { gte: filters.minPrice, lte: filters.maxPrice } as any
  if (filters.minQty || filters.maxQty)
    where.quantity = { gte: filters.minQty, lte: filters.maxQty }
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { category: { contains: filters.search, mode: 'insensitive' } },
      { sku: { contains: filters.search, mode: 'insensitive' } },
    ]
  }
  const total = await prisma.product.count({ where })
  const totalPages = Math.ceil(total / pageSize) || 1
  const skip = (page - 1) * pageSize
  const items = await prisma.product.findMany({
    where,
    orderBy: { [sortBy]: sortOrder },
    skip,
    take: pageSize,
    include: { store: true },
  })
  return { items, meta: { page, pageSize, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 } }
}

export async function getProduct(id: number) {
  return prisma.product.findUnique({ where: { id }, include: { store: true } })
}

export async function createProduct(data: Prisma.ProductCreateInput) {
  return prisma.product.create({ data })
}
export async function updateProduct(id: number, data: Prisma.ProductUpdateInput) {
  return prisma.product.update({ where: { id }, data })
}
export async function deleteProduct(id: number) {
  return prisma.product.delete({ where: { id } })
}
