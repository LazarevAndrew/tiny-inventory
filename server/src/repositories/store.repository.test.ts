import type { PrismaClient, Product, Store } from '@prisma/client'

import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import prisma from '../db/prisma'
import { listStores, storeSummary } from './store.repository'

jest.mock('../db/prisma')

const mockedPrisma = prisma as unknown as jest.Mocked<Pick<PrismaClient, 'store' | 'product'>>

beforeEach(() => {
  jest.clearAllMocks()
})

describe('store.repository', () => {
  test('listStores returns sorted stores', async () => {
    const stores: Array<Pick<Store, 'id' | 'name' | 'location'>> = [
      { id: 1, name: 'A', location: 'X' },
      { id: 2, name: 'B', location: 'Y' },
    ]

    mockedPrisma.store.findMany.mockResolvedValueOnce(stores as any)

    const res = await listStores()

    expect(mockedPrisma.store.findMany).toHaveBeenCalledWith({ orderBy: { id: 'asc' } })
    expect(res).toEqual(stores)
  })

  test('storeSummary returns empty when no products', async () => {
    const products: Product[] = []
    const stores: Array<Pick<Store, 'id' | 'name'>> = [{ id: 1, name: 'S1' }]

    mockedPrisma.product.findMany.mockResolvedValueOnce(products as any)
    mockedPrisma.store.findMany.mockResolvedValueOnce(stores as any)

    const res = await storeSummary()

    expect(mockedPrisma.product.findMany).toHaveBeenCalledWith({ where: {} })
    expect(res).toEqual([])
  })
})
