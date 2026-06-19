type LoginResp = { token: string }
type SignupPayload = { name: string; email: string; password: string }

const API_BASE = 'http://localhost:5001/api'

async function handleResp(res: Response) {
  let payload: any = null
  const text = await res.text().catch(() => '')
  try {
    payload = text ? JSON.parse(text) : null
  } catch (e) {
    payload = null
  }

  if (!res.ok) {
    const msg = payload?.message || text || res.statusText
    throw new Error(msg)
  }

  // If API wraps responses like { success: true, data: {...}, message }
  if (payload && typeof payload === 'object' && 'success' in payload && 'data' in payload) {
    return payload.data
  }

  // fallback: return parsed payload or empty object
  return payload ?? {}
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResp> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    return handleResp(res)
  },
  async signup(payload: SignupPayload): Promise<LoginResp> {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return handleResp(res)
  },
  async me(token: string): Promise<{ user: any; familyId?: string }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return handleResp(res)
  },
  async forgot(email: string) {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    return handleResp(res)
  },
  async reset(email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    return handleResp(res)
  },
  async logout(token?: string) {
    const res = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    return handleResp(res)
  },
  async verify(token: string) {
    // Email verification endpoint not defined in spec; keep as a POST to /auth/verify if required
    const res = await fetch(`${API_BASE}/auth/verify?token=${encodeURIComponent(token)}`)
    return handleResp(res)
  },
}
