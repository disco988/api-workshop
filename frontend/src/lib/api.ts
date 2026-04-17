import { useQuery, useMutation } from '@tanstack/react-query'
import type { Product, ProductListResponse } from '../types'

const BASE = '/api'

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) throw { status: res.status, ...data }
  return data
}

export const useProducts = (category?: string) =>
  useQuery<ProductListResponse>({
    queryKey: ['products', category],
    queryFn: () => apiFetch(`/produkty${category ? `?category=${category}` : ''}`),
  })

export const useProduct = (id: string) =>
  useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => apiFetch(`/produkty/${id}`),
    enabled: !!id,
  })

export const useCreateProduct = () =>
  useMutation({
    mutationFn: (body: Omit<Product, 'id' | 'created_at'>) =>
      apiFetch<Product>('/produkty', { method: 'POST', body: JSON.stringify(body) }),
  })

export const useUpdateProduct = () =>
  useMutation({
    mutationFn: ({ id, ...body }: Partial<Product> & { id: string }) =>
      apiFetch<Product>(`/produkty/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  })
