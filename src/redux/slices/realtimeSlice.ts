import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type AnyObj = Record<string, any>

interface RealtimeState {
  expenses: AnyObj[]
  incomes: AnyObj[]
  budgets: AnyObj[]
  goals: AnyObj[]
  goalContributions: AnyObj[]
  activities: AnyObj[]
  onlineMembers: AnyObj[]
}

const initialState: RealtimeState = {
  expenses: [],
  incomes: [],
  budgets: [],
  goals: [],
  goalContributions: [],
  activities: [],
  onlineMembers: [],
}

const slice = createSlice({
  name: 'realtime',
  initialState,
  reducers: {
    addExpenseRealtime(state, action: PayloadAction<AnyObj>) {
      state.expenses.unshift(action.payload)
    },
    updateExpenseRealtime(state, action: PayloadAction<AnyObj>) {
      const updated = action.payload
      state.expenses = state.expenses.map((e) => (e.id === updated.id ? updated : e))
    },
    deleteExpenseRealtime(state, action: PayloadAction<string>) {
      const id = action.payload
      state.expenses = state.expenses.filter((e) => e.id !== id)
    },

    addIncomeRealtime(state, action: PayloadAction<AnyObj>) {
      state.incomes.unshift(action.payload)
    },
    updateIncomeRealtime(state, action: PayloadAction<AnyObj>) {
      const updated = action.payload
      state.incomes = state.incomes.map((i) => (i.id === updated.id ? updated : i))
    },
    deleteIncomeRealtime(state, action: PayloadAction<string>) {
      const id = action.payload
      state.incomes = state.incomes.filter((i) => i.id !== id)
    },

    updateBudgetRealtime(state, action: PayloadAction<AnyObj>) {
      const updated = action.payload
      state.budgets = state.budgets.map((b) => (b.id === updated.id ? updated : b))
    },

    addGoalRealtime(state, action: PayloadAction<AnyObj>) {
      state.goals.unshift(action.payload)
    },
    updateGoalRealtime(state, action: PayloadAction<AnyObj>) {
      const updated = action.payload
      state.goals = state.goals.map((g) => (g.id === updated.id ? updated : g))
    },
    deleteGoalRealtime(state, action: PayloadAction<string>) {
      const id = action.payload
      state.goals = state.goals.filter((g) => g.id !== id)
    },

    addGoalContributionRealtime(state, action: PayloadAction<AnyObj>) {
      state.goalContributions.unshift(action.payload)
    },
    updateGoalContributionRealtime(state, action: PayloadAction<AnyObj>) {
      const updated = action.payload
      state.goalContributions = state.goalContributions.map((c) => (c.id === updated.id ? updated : c))
    },
    deleteGoalContributionRealtime(state, action: PayloadAction<string>) {
      const id = action.payload
      state.goalContributions = state.goalContributions.filter((c) => c.id !== id)
    },

    addActivity(state, action: PayloadAction<AnyObj>) {
      state.activities.unshift(action.payload)
    },

    setOnlineMembers(state, action: PayloadAction<AnyObj[]>) {
      state.onlineMembers = action.payload || []
    },
    addOnlineMember(state, action: PayloadAction<AnyObj>) {
      const member = action.payload
      if (!state.onlineMembers.find((m) => m.id === member.id)) state.onlineMembers.push(member)
    },
    removeOnlineMember(state, action: PayloadAction<string>) {
      const id = action.payload
      state.onlineMembers = state.onlineMembers.filter((m) => m.id !== id)
    },
  },
})

export const {
  addExpenseRealtime,
  updateExpenseRealtime,
  deleteExpenseRealtime,
  addIncomeRealtime,
  updateIncomeRealtime,
  deleteIncomeRealtime,
  updateBudgetRealtime,
  addGoalRealtime,
  updateGoalRealtime,
  deleteGoalRealtime,
  addGoalContributionRealtime,
  updateGoalContributionRealtime,
  deleteGoalContributionRealtime,
  addActivity,
  setOnlineMembers,
  addOnlineMember,
  removeOnlineMember,
} = slice.actions

export default slice.reducer
