const API_BASE = 'http://localhost:5001/api'

type QueryParams = Record<string, string | number | boolean | undefined>

function buildQueryString(params: QueryParams | undefined): string {
  if (!params) return ''
  return Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&')
}

function buildUrl(path: string, params?: QueryParams) {
  const qs = buildQueryString(params)
  // allow callers to pass a full path starting with /; prepend base
  return `${API_BASE}${path}${qs ? `?${qs}` : ''}`
}

const inFlight = new Map<string, Promise<any>>()

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('nl_token') : null

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`)
  }

  // attempt JSON parse
  return response.json() as Promise<T>
}

export function apiGet<T>(path: string, params?: QueryParams): Promise<T> {
  const url = buildUrl(path, params)
  if (inFlight.has(url)) return inFlight.get(url) as Promise<T>

  const p = request<T>(url, { method: 'GET' })
    .finally(() => inFlight.delete(url))

  inFlight.set(url, p)
  return p
}

export function apiPost<T>(path: string, body: unknown): Promise<T> {
  const url = buildUrl(path)
  return request<T>(url, { method: 'POST', body: JSON.stringify(body) })
}

export function apiPut<T>(path: string, body: unknown): Promise<T> {
  const url = buildUrl(path)
  return request<T>(url, { method: 'PUT', body: JSON.stringify(body) })
}

export function apiDelete<T = void>(path: string): Promise<T> {
  const url = buildUrl(path)
  return request<T>(url, { method: 'DELETE' })
}
