export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

async function request(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: { message: 'Unknown error' } }))
    throw new Error(err?.error?.message || `HTTP ${res.status}`)
  }
  return res.json()
}

export const api = {
  // Stores
  getStores: () => request('/stores'),
  createStore: (payload: { name: string, location?: string }) =>
    request('/stores', { method: 'POST', body: JSON.stringify(payload) }),
  updateStore: (id: number, payload: { name?: string, location?: string | null }) =>
    request(`/stores/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteStore: (id: number) => request(`/stores/${id}`, { method: 'DELETE' }),
  getStoreSummary: (storeId?: number) =>
    request(storeId ? `/stores/${storeId}/summary` : '/stores/summary'),

  // Products
  getProducts: (params: Record<string, string | number | undefined>) => {
    const qs = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '')
        qs.append(k, String(v))
    })
    return request(`/products?${qs.toString()}`)
  },
  getProduct: (id: number) => request(`/products/${id}`),
  createProduct: (payload: {
    name: string
    category: string
    price: number
    quantity: number
    sku: string
    storeId: number
  }) => request('/products', { method: 'POST', body: JSON.stringify(payload) }),
  updateProduct: (
    id: number,
    payload: Partial<{
      name: string
      category: string
      price: number
      quantity: number
      sku: string
      storeId: number
    }>,
  ) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteProduct: (id: number) => request(`/products/${id}`, { method: 'DELETE' }),
}
