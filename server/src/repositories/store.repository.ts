import type { Product, Store } from '@prisma/client'
import prisma from '../db/prisma'

export async function listStores() {
  return prisma.store.findMany({ orderBy: { id: 'asc' } })
}
export async function getStore(id: number) {
  return prisma.store.findUnique({ where: { id }, include: { products: true } })
}
export async function createStore(data: { name: string, location?: string | null }) {
  return prisma.store.create({ data })
}
export async function updateStore(id: number, data: { name?: string, location?: string | null }) {
  return prisma.store.update({ where: { id }, data })
}
export async function deleteStore(id: number) {
  return prisma.store.delete({ where: { id } })
}
// Move storeSummary to store.service.ts (or a reports.service.ts) etc;

export async function storeSummary(id?: number, lowStockThreshold = 5) {
  const where: { storeId?: number } = id ? { storeId: id } : {}

  const products: Product[] = await prisma.product.findMany({ where })

  const byStore = new Map<
    number,
    {
      totalValue: number
      totalProducts: number
      lowStock: number
      avgPrice: number
      storeName?: string
      topCategories: { category: string, count: number }[]
    }
  >()

  // Fetch store names used in summaries
  const stores: Pick<Store, 'id' | 'name'>[] = id
    ? await prisma.store.findMany({ where: { id } })
    : await prisma.store.findMany({ select: { id: true, name: true } })

  const storeNameMap = new Map<number, string>()
  stores.forEach((s: Pick<Store, 'id' | 'name'>) => {
    storeNameMap.set(s.id, s.name)
  })

  // Per-store category counts
  const categoryCount = new Map<number, Map<string, number>>()

  for (const p of products) {
    const value = Number(p.price) * p.quantity

    const summary
      = byStore.get(p.storeId)
        ?? {
          totalValue: 0,
          totalProducts: 0,
          lowStock: 0,
          avgPrice: 0,
          storeName: storeNameMap.get(p.storeId),
          topCategories: [],
        }

    summary.totalValue += value
    summary.totalProducts += 1
    if (p.quantity <= lowStockThreshold)
      summary.lowStock += 1

    byStore.set(p.storeId, summary)

    const catMap = categoryCount.get(p.storeId) ?? new Map<string, number>()
    catMap.set(p.category, (catMap.get(p.category) ?? 0) + 1)
    categoryCount.set(p.storeId, catMap)
  }

  // Finalize avgPrice and topCategories for each store
  for (const [storeId, summary] of byStore) {
    const prods = products.filter((p: Product) => p.storeId === storeId)
    const sumPrice = prods.reduce((acc: number, p: Product) => acc + Number(p.price), 0)
    summary.avgPrice = prods.length ? Number((sumPrice / prods.length).toFixed(2)) : 0

    const cats = categoryCount.get(storeId) ?? new Map<string, number>()
    const top = Array
      .from(cats.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category, count]) => ({ category, count }))

    summary.topCategories = top
  }

  return Array.from(byStore.entries()).map(([storeId, s]) => ({
    storeId,
    storeName: s.storeName,
    totalInventoryValue: Number(s.totalValue.toFixed(2)),
    totalProducts: s.totalProducts,
    lowStockCount: s.lowStock,
    avgPrice: s.avgPrice,
    topCategories: s.topCategories,
  }))
}
