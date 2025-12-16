/**
 * API Client utility for making HTTP requests to the backend
 */

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean
}

class ApiClient {
  private baseURL: string

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4567'
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken')
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return headers
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { requiresAuth = false, headers, ...restOptions } = options

    const requestHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...(requiresAuth ? this.getAuthHeaders() : {}),
      ...headers,
    }

    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`

    try {
      const response = await fetch(url, {
        ...restOptions,
        headers: requestHeaders,
      })

      if (response.status === 401 && requiresAuth) {
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
        window.location.href = '/login'
        throw new Error('Sessão expirada. Faça login novamente.')
      }

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return data as T
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Erro de conexão com o servidor')
    }
  }

  async get<T>(endpoint: string, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', requiresAuth })
  }

  async post<T>(endpoint: string, body?: unknown, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      requiresAuth,
    })
  }

  async put<T>(endpoint: string, body?: unknown, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      requiresAuth,
    })
  }

  async patch<T>(endpoint: string, body?: unknown, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      requiresAuth,
    })
  }

  async delete<T>(endpoint: string, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', requiresAuth })
  }
}

export const apiClient = new ApiClient()
export default apiClient
