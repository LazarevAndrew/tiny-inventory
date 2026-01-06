import type { Prisma } from '@prisma/client'
import * as repo from '../repositories/product.repository'

export async function list(page: number, pageSize: number, filters: repo.ProductFilters, sortBy?: string, sortOrder?: 'asc' | 'desc') {
  const sortKey = (sortBy as any) || 'name'
  const order: 'asc' | 'desc' = sortOrder || 'asc'
  return repo.listProducts(page, pageSize, filters, sortKey, order)
}
export async function get(id: number) {
  return repo.getProduct(id)
}
export async function create(data: Prisma.ProductCreateInput) {
  return repo.createProduct(data)
}
export async function update(id: number, data: Prisma.ProductUpdateInput) {
  return repo.updateProduct(id, data)
}
export async function remove(id: number) {
  return repo.deleteProduct(id)
}
