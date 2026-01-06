import type { NextFunction, Request, Response } from 'express'
import * as service from '../services/store.service'

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await service.list())
  }
  catch (err) { next(err) }
}

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number.parseInt(req.params.id, 10)
    const store = await service.get(id)
    if (!store)
      return res.status(404).json({ error: { message: 'Store not found' } })
    res.json(store)
  }
  catch (err) { next(err) }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, location } = req.body
    if (!name || typeof name !== 'string' || name.length < 2)
      return res.status(400).json({ error: { message: 'Invalid store name' } })
    const store = await service.create({ name, location })
    res.status(201).json(store)
  }
  catch (err) { next(err) }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number.parseInt(req.params.id, 10)
    const { name, location } = req.body
    const store = await service.update(id, { name, location })
    res.json(store)
  }
  catch (err) { next(err) }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number.parseInt(req.params.id, 10)
    await service.remove(id)
    res.status(204).send()
  }
  catch (err) { next(err) }
}

export async function summary(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id ? Number.parseInt(req.params.id, 10) : undefined
    const threshold = req.query.threshold ? Number.parseInt(req.query.threshold as string, 10) : 5
    const stats = await service.summary(id, threshold)
    res.json(stats)
  }
  catch (err) { next(err) }
}
