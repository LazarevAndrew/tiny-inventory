import { beforeEach, describe, expect, jest, test } from '@jest/globals'

import * as repo from '../repositories/product.repository'
import * as service from './product.service'

jest.mock('../repositories/product.repository')

const mockedRepo = jest.mocked(repo, { shallow: true })

beforeEach(() => {
  jest.clearAllMocks()
})

describe('product.service (delegation to repository)', () => {
  test('list delegates with provided pagination, filters, and sort params', async () => {
    const page = 2
    const pageSize = 20
    const filters: repo.ProductFilters = { category: 'Electronics', storeId: 3, minPrice: 10, maxPrice: 100 }
    const sortBy = 'price'
    const sortOrder: 'asc' | 'desc' = 'desc'

    const expectedResult = {
      items: [
        { id: 11, name: 'USB-C Cable', category: 'Electronics', price: 12.99, quantity: 5, storeId: 3 },
        { id: 12, name: 'Laptop Sleeve', category: 'Electronics', price: 19.99, quantity: 10, storeId: 3 },
      ],
      page,
      pageSize,
      total: 42,
    }

    mockedRepo.listProducts.mockResolvedValueOnce(expectedResult as any)

    const res = await service.list(page, pageSize, filters, sortBy, sortOrder)

    expect(mockedRepo.listProducts).toHaveBeenCalledWith(page, pageSize, filters, 'price', 'desc')
    expect(res).toEqual(expectedResult)
  })

  test('list uses defaults when sort params are not provided (sortBy -> name, sortOrder -> asc)', async () => {
    const page = 1
    const pageSize = 10
    const filters: repo.ProductFilters = { category: 'Grocery' }

    const expectedResult = {
      items: [
        { id: 1, name: 'Banana', category: 'Grocery', price: 0.59, quantity: 80, storeId: 1 },
        { id: 2, name: 'Red Apple', category: 'Grocery', price: 0.99, quantity: 120, storeId: 1 },
      ],
      page,
      pageSize,
      total: 2,
    }

    mockedRepo.listProducts.mockResolvedValueOnce(expectedResult as any)

    const res = await service.list(page, pageSize, filters)

    expect(mockedRepo.listProducts).toHaveBeenCalledWith(page, pageSize, filters, 'name', 'asc')
    expect(res).toEqual(expectedResult)
  })

  test('get delegates to repo.getProduct with id', async () => {
    mockedRepo.getProduct.mockResolvedValueOnce({ id: 10, name: 'LED Bulb', category: 'Hardware' } as any)

    const res = await service.get(10)

    expect(mockedRepo.getProduct).toHaveBeenCalledWith(10)
    expect(res).toEqual({ id: 10, name: 'LED Bulb', category: 'Hardware' })
  })

  test('create delegates to repo.createProduct with data', async () => {
    const payload = {
      name: 'Safety Gloves',
      category: 'Hardware',
      price: 7.25,
      quantity: 10,
      sku: 'HW-GLO-010',
      store: { connect: { id: 2 } },
    }

    mockedRepo.createProduct.mockResolvedValueOnce({ id: 33, name: 'Safety Gloves', category: 'Hardware' } as any)

    const res = await service.create(payload)

    expect(mockedRepo.createProduct).toHaveBeenCalledWith(payload)
    expect(res).toEqual({ id: 33, name: 'Safety Gloves', category: 'Hardware' })
  })

  test('update delegates to repo.updateProduct with id + data', async () => {
    const data = { price: 8.0, quantity: 12 }
    mockedRepo.updateProduct.mockResolvedValueOnce({ id: 33, name: 'Safety Gloves', price: 8.0, quantity: 12 } as any)

    const res = await service.update(33, data)

    expect(mockedRepo.updateProduct).toHaveBeenCalledWith(33, data)
    expect(res).toEqual({ id: 33, name: 'Safety Gloves', price: 8.0, quantity: 12 })
  })

  test('remove delegates to repo.deleteProduct with id', async () => {
    mockedRepo.deleteProduct.mockResolvedValueOnce({ id: 44 } as any)

    const res = await service.remove(44)

    expect(mockedRepo.deleteProduct).toHaveBeenCalledWith(44)
    expect(res).toEqual({ id: 44 })
  })

  test('get propagates repository errors', async () => {
    const err = new Error('Not found')

    mockedRepo.getProduct.mockRejectedValueOnce(err)

    await expect(service.get(999)).rejects.toThrow('Not found')
    expect(mockedRepo.getProduct).toHaveBeenCalledWith(999)
  })

  test('create propagates repository errors', async () => {
    const payload = { name: '', category: 'Grocery', price: 1, quantity: 1, store: { connect: { id: 1 } } } as any
    const err = new Error('Validation failed')

    mockedRepo.createProduct.mockRejectedValueOnce(err)

    await expect(service.create(payload)).rejects.toThrow('Validation failed')
    expect(mockedRepo.createProduct).toHaveBeenCalledWith(payload)
  })

  test('update propagates repository errors', async () => {
    const err = new Error('Cannot update non-existent product')

    mockedRepo.updateProduct.mockRejectedValueOnce(err)

    await expect(service.update(12345, { price: 2.5 } as any)).rejects.toThrow('Cannot update non-existent product')
    expect(mockedRepo.updateProduct).toHaveBeenCalledWith(12345, { price: 2.5 })
  })

  test('remove propagates repository errors', async () => {
    const err = new Error('Delete failed')

    mockedRepo.deleteProduct.mockRejectedValueOnce(err)

    await expect(service.remove(54321)).rejects.toThrow('Delete failed')
    expect(mockedRepo.deleteProduct).toHaveBeenCalledWith(54321)
  })
})
