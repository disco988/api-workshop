export interface Product {
  id: string
  name: string
  price: number
  category: string
  stock: number
  created_at: string
  updated_at?: string
}

export interface ProductListResponse {
  total: number
  page: number
  limit: number
  items: Product[]
}

export interface ApiError {
  error: string
  missing?: string[]
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export interface RequestResult {
  status: number
  statusText: string
  data: unknown
  duration: number
  ok: boolean
}

export type TabId = 'docs' | 'exercises' | 'playground'

export interface Exercise {
  id: string
  number: number
  title: string
  description: string
  hint: string
  method: HttpMethod
  expectedStatus: number
  validate: (result: RequestResult, body?: string) => ValidationResult
}

export interface ValidationResult {
  passed: boolean
  message: string
}
