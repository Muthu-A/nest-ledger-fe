import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { createSocket, disconnectSocket, on, off, joinFamilyRoom } from '../socket/socket'
import { EVENTS } from '../socket/socketEvents'

type AnyObj = Record<string, any>

type RealtimeState = {
  incomes: AnyObj[]
  expenses: AnyObj[]
  activities: AnyObj[]
  onlineMembers: AnyObj[]
}

type RealtimeContextValue = RealtimeState & {
  addIncome: (i: AnyObj) => void
  updateIncome: (i: AnyObj) => void
  deleteIncome: (id: string) => void

  addExpense: (e: AnyObj) => void
  updateExpense: (e: AnyObj) => void
  deleteExpense: (id: string) => void

  addBudget: (b: AnyObj) => void
  updateBudget: (b: AnyObj) => void
  deleteBudget: (id: string) => void

  addGoal: (g: AnyObj) => void
  updateGoal: (g: AnyObj) => void
  deleteGoal: (id: string) => void

  addGoalContribution: (c: AnyObj) => void
  updateGoalContribution: (c: AnyObj) => void
  deleteGoalContribution: (id: string) => void

  addActivity: (a: AnyObj) => void
  addOnlineMember: (m: AnyObj) => void
  removeOnlineMember: (id: string) => void
}

const RealtimeContext = createContext<RealtimeContextValue | undefined>(undefined)

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [incomes, setIncomes] = useState<AnyObj[]>([])
  const [expenses, setExpenses] = useState<AnyObj[]>([])
  const [activities, setActivities] = useState<AnyObj[]>([])
  const [onlineMembers, setOnlineMembers] = useState<AnyObj[]>([])
  const [budgets, setBudgets] = useState<AnyObj[]>([])
  const [goals, setGoals] = useState<AnyObj[]>([])
  const [goalContributions, setGoalContributions] = useState<AnyObj[]>([])

  useEffect(() => {
    const token = localStorage.getItem('nl_token')
    const familyId = (() => {
      try {
        const raw = localStorage.getItem('nl_family')
        if (!raw) return null
        return JSON.parse(raw)?.id ?? raw
      } catch (e) {
        return null
      }
    })()

    if (!token) return undefined

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'
    const socket = createSocket(API_URL, token)

    // join family room if available
    if (familyId) joinFamilyRoom(familyId)

    const normalize = (payload: any) => {
      if (!payload) return payload
      if (typeof payload !== 'object') return payload
      // prefer `id`, fallback to Mongo `_id`
      const id = payload.id ?? payload._id ?? payload._id?.toString()
      if (id && payload.id !== id) return { ...payload, id }
      return payload
    }

    const handlers: Array<[string, (...args: any[]) => void]> = [
      // Expenses
      [EVENTS.EXPENSE_CREATED, (payload: any) => {
        const item = normalize(payload)
        setExpenses((s) => [item, ...s])
      }],
      [EVENTS.EXPENSE_UPDATED, (payload: any) => {
        const item = normalize(payload)
        setExpenses((s) => s.map((e) => (e.id === item.id ? item : e)))
      }],
      [EVENTS.EXPENSE_DELETED, (payload: any) => {
        const id = typeof payload === 'string' ? payload : (payload?.id ?? payload?._id)
        if (!id) return
        setExpenses((s) => s.filter((e) => e.id !== id))
      }],

      // Incomes
      [EVENTS.INCOME_CREATED, (payload: any) => {
        const item = normalize(payload)
        setIncomes((s) => [item, ...s])
      }],
      [EVENTS.INCOME_UPDATED, (payload: any) => {
        const item = normalize(payload)
        setIncomes((s) => s.map((i) => (i.id === item.id ? item : i)))
      }],
      [EVENTS.INCOME_DELETED, (payload: any) => {
        const id = typeof payload === 'string' ? payload : (payload?.id ?? payload?._id)
        if (!id) return
        setIncomes((s) => s.filter((i) => i.id !== id))
      }],

      // Budgets
      [EVENTS.BUDGET_CREATED, (payload: any) => {
        const item = normalize(payload)
        setBudgets((s) => [item, ...s])
      }],
      [EVENTS.BUDGET_UPDATED, (payload: any) => {
        const item = normalize(payload)
        setBudgets((s) => s.map((b) => (b.id === item.id ? item : b)))
      }],
      [EVENTS.BUDGET_DELETED, (payload: any) => {
        const id = typeof payload === 'string' ? payload : (payload?.id ?? payload?._id)
        if (!id) return
        setBudgets((s) => s.filter((b) => b.id !== id))
      }],

      // Goals
      [EVENTS.GOAL_CREATED, (payload: any) => {
        const item = normalize(payload)
        setGoals((s) => [item, ...s])
      }],
      [EVENTS.GOAL_UPDATED, (payload: any) => {
        const item = normalize(payload)
        setGoals((s) => s.map((g) => (g.id === item.id ? item : g)))
      }],
      [EVENTS.GOAL_DELETED, (payload: any) => {
        const id = typeof payload === 'string' ? payload : (payload?.id ?? payload?._id)
        if (!id) return
        setGoals((s) => s.filter((g) => g.id !== id))
      }],

      // Goal contributions
      [EVENTS.GOAL_CONTRIBUTION_ADDED, (payload: any) => {
        const item = normalize(payload)
        setGoalContributions((s) => [item, ...s])
      }],
      [EVENTS.GOAL_CONTRIBUTION_UPDATED, (payload: any) => {
        const item = normalize(payload)
        setGoalContributions((s) => s.map((c) => (c.id === item.id ? item : c)))
      }],
      [EVENTS.GOAL_CONTRIBUTION_DELETED, (payload: any) => {
        const id = typeof payload === 'string' ? payload : (payload?.id ?? payload?._id)
        if (!id) return
        setGoalContributions((s) => s.filter((c) => c.id !== id))
      }],

      // Activities
      [EVENTS.ACTIVITY_CREATED, (payload: any) => {
        const item = normalize(payload)
        setActivities((s) => [item, ...s])
      }],

      // Online users
      [EVENTS.USER_ONLINE, (payload: any) => {
        const member = normalize(payload)
        if (!member || !member.id) return
        setOnlineMembers((s) => (s.find((m) => m.id === member.id) ? s : [...s, member]))
      }],
      [EVENTS.USER_OFFLINE, (payload: any) => {
        const id = typeof payload === 'string' ? payload : (payload?.id ?? payload?._id)
        if (!id) return
        setOnlineMembers((s) => s.filter((m) => m.id !== id))
      }],

      // family online snapshot
      [EVENTS.FAMILY_ONLINE_MEMBERS, (payload: any) => setOnlineMembers(payload || [])],
    ]

    for (const [ev, h] of handlers) on(ev, h)

    return () => {
      for (const [ev, h] of handlers) off(ev, h)
      try {
        disconnectSocket()
      } catch (e) {}
    }
  }, [])

  const value = useMemo(() => ({
    incomes,
    expenses,
    activities,
    onlineMembers,
    budgets,
    goals,
    goalContributions,

    // incomes
    addIncome: (i: AnyObj) => setIncomes((s) => [i, ...s]),
    updateIncome: (i: AnyObj) => setIncomes((s) => s.map((x) => (x.id === i.id ? i : x))),
    deleteIncome: (id: string) => setIncomes((s) => s.filter((x) => x.id !== id)),

    // expenses
    addExpense: (e: AnyObj) => setExpenses((s) => [e, ...s]),
    updateExpense: (e: AnyObj) => setExpenses((s) => s.map((x) => (x.id === e.id ? e : x))),
    deleteExpense: (id: string) => setExpenses((s) => s.filter((x) => x.id !== id)),

    // budgets
    addBudget: (b: AnyObj) => setBudgets((s) => [b, ...s]),
    updateBudget: (b: AnyObj) => setBudgets((s) => s.map((x) => (x.id === b.id ? b : x))),
    deleteBudget: (id: string) => setBudgets((s) => s.filter((x) => x.id !== id)),

    // goals
    addGoal: (g: AnyObj) => setGoals((s) => [g, ...s]),
    updateGoal: (g: AnyObj) => setGoals((s) => s.map((x) => (x.id === g.id ? g : x))),
    deleteGoal: (id: string) => setGoals((s) => s.filter((x) => x.id !== id)),

    // goal contributions
    addGoalContribution: (c: AnyObj) => setGoalContributions((s) => [c, ...s]),
    updateGoalContribution: (c: AnyObj) => setGoalContributions((s) => s.map((x) => (x.id === c.id ? c : x))),
    deleteGoalContribution: (id: string) => setGoalContributions((s) => s.filter((x) => x.id !== id)),

    // activities & online
    addActivity: (a: AnyObj) => setActivities((s) => [a, ...s]),
    addOnlineMember: (m: AnyObj) => setOnlineMembers((s) => (s.find((x) => x.id === m.id) ? s : [...s, m])),
    removeOnlineMember: (id: string) => setOnlineMembers((s) => s.filter((x) => x.id !== id)),
  }), [incomes, expenses, activities, onlineMembers, budgets, goals, goalContributions])

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>
}

export function useRealtime() {
  const ctx = useContext(RealtimeContext)
  if (!ctx) throw new Error('useRealtime must be used within RealtimeProvider')
  return ctx
}

export default RealtimeContext
