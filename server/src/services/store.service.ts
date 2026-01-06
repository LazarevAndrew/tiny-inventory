
import * as repo from '../repositories/store.repository'
export async function list() { return repo.listStores() }
export async function get(id: number) { return repo.getStore(id) }
export async function create(data: { name: string; location?: string | null }) { return repo.createStore(data) }
export async function update(id: number, data: { name?: string; location?: string | null }) { return repo.updateStore(id, data) }
export async function remove(id: number) { return repo.deleteStore(id) }
export async function summary(id?: number, lowStockThreshold = 5) { return repo.storeSummary(id, lowStockThreshold) }
