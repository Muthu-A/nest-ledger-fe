import React, { createContext, useEffect, useState } from 'react'
import { authService } from '../services/authService'
import { familyService } from '../services/familyService'

// module-level in-flight bootstrap promise to dedupe concurrent bootstraps
let bootstrapInFlight: Promise<unknown> | null = null

export type User = {
  id: string
  name: string
  email: string
}

export type Member = {
  id: string
  name: string
  email: string
  role: 'owner' | 'editor' | 'viewer'
}

export type Family = {
  ownerId: string
  id: string
  name: string
  members: Member[]
}

function normalizeFamily(raw: unknown): Family | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  let f: Record<string, unknown> = r
  if ('family' in r && typeof r.family === 'object') f = r.family as Record<string, unknown>
  if ('data' in r && typeof r.data === 'object') f = r.data as Record<string, unknown>

  const id = String(f['id'] ?? f['_id'] ?? f['familyId'] ?? r['familyId'] ?? r['id'] ?? '')
  if (!id) return null

  const ownerId = String(f['ownerId'] ?? '')
  const name = String(f['name'] ?? '')

  const membersRaw = f['members']
  const members: Member[] = Array.isArray(membersRaw)
    ? membersRaw.map((m) => {
        const mm = m as Record<string, unknown>
        return {
          id: String(mm['id'] ?? mm['_id'] ?? ''),
          name: String(mm['name'] ?? ''),
          email: String(mm['email'] ?? ''),
          role: (mm['role'] as Member['role']) ?? 'viewer',
        }
      })
    : []

  return { id, ownerId, name, members }
}

type AuthContextType = {
  user: User | null
  // backward compatible fields
  family: Family | null
  loading: boolean
  familyId: string | null
  userRole: Member['role'] | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<string | null>
  signup: (email: string, password: string, name?: string) => Promise<void>
  logout: () => void
  createFamily: (name: string) => Promise<string>
  joinFamily: (invitationCode: string) => Promise<string>
  verifyToken: () => Promise<void>
  // UI controls
  showFamilyMgmt: boolean
  openFamilyManagement: () => void
  closeFamilyManagement: () => void
  // backwards-compat helpers (keep available)
  inviteMember: (email: string) => Promise<void>
  removeMember: (memberId: string) => Promise<void>
  changeMemberRole: (memberId: string, role: Member['role']) => Promise<void>
  // refresh family data from API
  refreshFamily: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const LOCAL_TOKEN_KEY = 'nl_token'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [family, setFamily] = useState<Family | null>(null)
  const [userRole, setUserRole] = useState<Member['role'] | null>(null)
  const [showFamilyMgmt, setShowFamilyMgmt] = useState(false)

  useEffect(() => {
    const t = localStorage.getItem(LOCAL_TOKEN_KEY)
    if (t) {
      setToken(t)
      verifyToken().finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Deduping handled at module level via `bootstrapInFlight`.

  // Module-level in-flight bootstrap dedupe. This prevents duplicate network
  // calls when React StrictMode mounts components twice during development.

  async function bootstrap(t: string) {
    // reuse in-flight bootstrap if present
    if (bootstrapInFlight) return bootstrapInFlight

    bootstrapInFlight = (async () => {
      try {
        const profile = await authService.me(t)
        setUser(profile.user)
        setToken(t)
        if (profile.familyId) {
          const fam = await familyService.getFamily(profile.familyId, t)
        const normFam = normalizeFamily(fam)
        setFamily(normFam || null)
        const me = normFam?.members?.find((m) => m.email === profile.user.email) ?? null
        setUserRole(me?.role ?? null)
      } else {
        setFamily(null)
        setUserRole(null)
      }
      return profile
      } catch (err) {
        console.error('bootstrap failed', err)
        localStorage.removeItem(LOCAL_TOKEN_KEY)
        setToken(null)
        setUser(null)
        setFamily(null)
        setUserRole(null)
        throw err
      } finally {
        // clear in-flight marker so future bootstraps can run if needed
        bootstrapInFlight = null
      }
    })()

    return bootstrapInFlight
  }

  async function verifyToken() {
    const t = localStorage.getItem(LOCAL_TOKEN_KEY)
    if (!t) {
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    try {
      await bootstrap(t)
    } catch (err) {
      // bootstrap already cleared token/user on failure
    } finally {
      setIsLoading(false)
    }
  }

  async function login(email: string, password: string) {
    setIsLoading(true)
    try {
      const res = await authService.login(email, password)
      localStorage.setItem(LOCAL_TOKEN_KEY, res.token)
      setToken(res.token)
      // bootstrap will populate user and family where available; capture profile
      const profile = await bootstrap(res.token)

      // determine effective family id: prefer profile.familyId, then login response
      const resp = res as Record<string, unknown>
      let effectiveFamilyId: string | null = profile?.familyId ?? (resp['familyId'] as string | undefined) ?? null

      // if we still don't have a full family object but login returned familyId, fetch it
      if (!profile?.familyId && resp['familyId']) {
        try {
          const fam = await familyService.getFamily(resp['familyId'] as string, resp['token'] as string)
          setFamily(fam || null)
          const famObj = fam as Family | null
          const respUserEmail = String((resp['user'] as Record<string, unknown>)?.['email'] ?? '')
          const me = famObj?.members?.find((m: Member) => m.email === respUserEmail) ?? null
          setUserRole(me?.role ?? (resp['role'] as Member['role']) ?? 'owner')
          effectiveFamilyId = famObj?.id ?? (resp['familyId'] as string)
        } catch (err) {
          // ignore
        }
      }

      return effectiveFamilyId
    } finally {
      setIsLoading(false)
    }
  }

  async function signup(email: string, password: string, name?: string) {
    setIsLoading(true)
    try {
      const payload = { name: name || 'User', email, password }
      const res = await authService.signup(payload)
      localStorage.setItem(LOCAL_TOKEN_KEY, res.token)
      setToken(res.token)
      await bootstrap(res.token)
    } finally {
      setIsLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem(LOCAL_TOKEN_KEY)
    setToken(null)
    setUser(null)
    setFamily(null)
    setUserRole(null)
  }

  async function createFamily(name: string) {
    if (!token || !user) throw new Error('Not authenticated')
    try {
      // do not flip global auth loading here — UI components use local modal loading
      const created = await familyService.createFamily(name, token)
      let fam = created as unknown
      // backend may return only { familyId: '...' } — fetch full family in that case
      if (created && typeof created === 'object' && 'familyId' in created) {
        try {
          fam = await familyService.getFamily((created as Record<string, unknown>)['familyId'] as string, token)
        } catch (err) {
          fam = { id: (created as Record<string, unknown>)['familyId'] }
        }
      }
      const normFam = normalizeFamily(fam)
      setFamily(normFam || null)
      const me = normFam?.members?.find((m) => m.email === user?.email) ?? null
      setUserRole(me?.role ?? 'owner')
      const famRec = fam as Record<string, unknown>
      const createdRec = created as Record<string, unknown>
      return String(famRec['id'] ?? famRec['_id'] ?? createdRec['familyId'] ?? '')
    } finally {
      setIsLoading(false)
    }
  }

  async function joinFamily(code: string) {
    // prefer token from localStorage to avoid stale React state during fast auth flows
    const t = localStorage.getItem(LOCAL_TOKEN_KEY) || token
    if (!t) throw new Error('Not authenticated')

    // ensure user profile is loaded; bootstrap from token if necessary
    if (!user) {
      try {
        await bootstrap(t)
      } catch (err) {
        // bootstrap will clear token/user on failure
      }
    }

    try {
      // debug: log tokens to help trace mismatches
      const fam = await familyService.joinFamily(code, t as string)
      
      // keep global auth loading untouched
      const normFam = normalizeFamily(fam)
      setFamily(normFam || null)
      const me = normFam?.members?.find((m) => m.email === user?.email) ?? null
      setUserRole(me?.role ?? null)
      
      
      return normFam?.id ?? (normFam as unknown as Record<string, unknown>)['familyId'] ?? ''
    } finally {
      setIsLoading(false)
    }
  }

  async function inviteMember(email: string) {
    if (!token || !family) throw new Error('No family')
    try {
      await familyService.inviteMember(family.id, email, token)
      // use local loading UI in the component that calls this
    } finally {
      setIsLoading(false)
    }
  }

  async function removeMember(memberId: string) {
    if (!token || !family) throw new Error('No family')
    try {
      await familyService.removeMember(family.id, memberId, token)
      // const normFam = normalizeFamily(fam)
      // setFamily(normFam)
    } finally {
      setIsLoading(false)
    }
  }

  async function changeMemberRole(memberId: string, role: Member['role']) {
    if (!token || !family) throw new Error('No family')
    try {
      const fam = await familyService.changeMemberRole(family.id, memberId, role, token)
      const normFam = normalizeFamily(fam)
      setFamily(normFam)
    } finally {
      setIsLoading(false)
    }
  }

  async function refreshFamily() {
    if (!token || !family?.id) return
    try {
      const fam = await familyService.getFamily(family.id, token)
      const normFam = normalizeFamily(fam)
      
      setFamily(normFam)
      const me = normFam?.members?.find((m) => m.email === user?.email) ?? null
      setUserRole(me?.role ?? null)
      return fam
    } catch (err) {
      console.error('refreshFamily failed', err)
    }
  }

  function openFamilyManagement() {
    setShowFamilyMgmt(true)
  }

  function closeFamilyManagement() {
    setShowFamilyMgmt(false)
  }

  const value: AuthContextType = {
    user,
    // keep full family object for backward compatibility
    family,
    loading: isLoading,
    familyId: family?.id ?? null,
    userRole,
    isAuthenticated: !!user && !!token,
    isLoading,
    showFamilyMgmt,
    openFamilyManagement,
    closeFamilyManagement,
    refreshFamily,
    login,
    signup,
    logout,
    createFamily,
    joinFamily,
    verifyToken,
    inviteMember,
    removeMember,
    changeMemberRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
