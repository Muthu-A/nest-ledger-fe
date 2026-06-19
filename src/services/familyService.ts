import { apiGet, apiPost, apiPut, apiDelete } from './api'

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

  if (payload && typeof payload === 'object' && 'success' in payload && 'data' in payload) {
    return payload.data
  }

  return payload ?? {}
}

export const familyService = {
  async createFamily(name: string, token: string) {
    return apiPost('/family/create', { name })
  },
  async joinFamily(code: string, token: string) {
    return apiPost(`/family/invite/${encodeURIComponent(code)}/accept`, {})
  },
  async getFamily(id: string, token?: string) {
    // if caller provided an explicit token, use it directly to ensure header is sent
    if (token) {
      const res = await fetch(`${API_BASE}/family/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return handleResp(res)
    }

    return apiGet(`/family/${id}`)
  },
  async listFamilies(token: string) {
    return apiGet('/family')
  },
  async inviteMember(familyId: string, email: string, token: string) {
    return apiPost(`/family/${familyId}/invite`, { email })
  },
  async removeMember(familyId: string, userId: string, token: string) {
    return apiDelete(`/family/${familyId}/members/${userId}`)
  },
  async changeMemberRole(familyId: string, userId: string, role: string, token: string) {
    return apiPut(`/family/${familyId}/members/${userId}/role`, { role })
  },
  async listInvites(familyId: string, token: string) {
    return apiGet(`/family/${familyId}/invites`)
  },
  async acceptInvite(code: string, token: string) {
    return apiPost(`/family/invite/${encodeURIComponent(code)}/accept`, {})
  },
  async rejectInvite(code: string, token: string) {
    return apiPost(`/family/invite/${encodeURIComponent(code)}/reject`, {})
  },
  async leaveFamily(familyId: string, token: string) {
    return apiPost(`/family/${familyId}/leave`, {})
  },
}
