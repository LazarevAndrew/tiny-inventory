import { beforeEach, describe, expect, jest, test } from '@jest/globals'

import * as repo from '../repositories/store.repository'
import * as service from './store.service'

jest.mock('../repositories/store.repository')

const mockedRepo = jest.mocked(repo, { shallow: true })

beforeEach(() => {
  jest.clearAllMocks()
})

describe('store.service (delegation to repository)', () => {
  test('get delegates to repo.getStore with id', async () => {
    mockedRepo.getStore.mockResolvedValueOnce({ id: 10, name: 'S', products: [] } as any)

    const res = await service.get(10)

    expect(mockedRepo.getStore).toHaveBeenCalledWith(10)
    expect(res).toEqual({ id: 10, name: 'S', products: [] })
  })

  test('create delegates to repo.createStore with data', async () => {
    const payload = { name: 'New', location: null }
    mockedRepo.createStore.mockResolvedValueOnce({ id: 1, ...payload } as any)

    const res = await service.create(payload)

    expect(mockedRepo.createStore).toHaveBeenCalledWith(payload)
    expect(res).toEqual({ id: 1, name: 'New', location: null })
  })

  test('update delegates to repo.updateStore with id and data', async () => {
    const data = { name: 'U', location: 'L' }
    mockedRepo.updateStore.mockResolvedValueOnce({ id: 5, ...data } as any)

    const res = await service.update(5, data)

    expect(mockedRepo.updateStore).toHaveBeenCalledWith(5, data)
    expect(res).toEqual({ id: 5, name: 'U', location: 'L' })
  })

  test('remove delegates to repo.deleteStore with id', async () => {
    mockedRepo.deleteStore.mockResolvedValueOnce({ id: 7 } as any)

    const res = await service.remove(7)

    expect(mockedRepo.deleteStore).toHaveBeenCalledWith(7)
    expect(res).toEqual({ id: 7 })
  })

  test('summary delegates to repo.storeSummary with defaults', async () => {
    const output = [
      {
        storeId: 1,
        storeName: 'S1',
        totalInventoryValue: 12.34,
        totalProducts: 2,
        lowStockCount: 1,
        avgPrice: 6.17,
        topCategories: [{ category: 'Grocery', count: 2 }],
      },
    ]

    mockedRepo.storeSummary.mockResolvedValueOnce(output)

    const res = await service.summary()

    expect(mockedRepo.storeSummary).toHaveBeenCalledWith(undefined, 5)
    expect(res).toEqual(output)
  })

  test('summary delegates to repo.storeSummary with id and custom threshold', async () => {
    const output = [
      {
        storeId: 2,
        storeName: 'S2',
        totalInventoryValue: 1.23,
        totalProducts: 3,
        lowStockCount: 0,
        avgPrice: 0.41,
        topCategories: [{ category: 'Electronics', count: 1 }],
      },
    ]

    mockedRepo.storeSummary.mockResolvedValueOnce(output)

    const res = await service.summary(2, 8)

    expect(mockedRepo.storeSummary).toHaveBeenCalledWith(2, 8)
    expect(res).toEqual(output)
  })

  test('get propagates repository errors', async () => {
    const err = new Error('Not found')
    mockedRepo.getStore.mockRejectedValueOnce(err)

    await expect(service.get(999)).rejects.toThrow('Not found')
    expect(mockedRepo.getStore).toHaveBeenCalledWith(999)
  })

  test('create propagates repository errors', async () => {
    const err = new Error('Validation failed')
    mockedRepo.createStore.mockRejectedValueOnce(err)

    await expect(service.create({ name: '' })).rejects.toThrow('Validation failed')
    expect(mockedRepo.createStore).toHaveBeenCalledWith({ name: '' })
  })
})
