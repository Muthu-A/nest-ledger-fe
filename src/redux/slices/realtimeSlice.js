import { createSlice } from '@reduxjs/toolkit'

const initialState = {
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
    addExpenseRealtime(state, action) {
      const payload = action.payload
      state.expenses.unshift(payload)
    },
    updateExpenseRealtime(state, action) {
      const updated = action.payload
      state.expenses = state.expenses.map((e) => (e.id === updated.id ? updated : e))
    },
    deleteExpenseRealtime(state, action) {
      const id = action.payload
      state.expenses = state.expenses.filter((e) => e.id !== id)
    },

    addIncomeRealtime(state, action) {
      state.incomes.unshift(action.payload)
    },
    updateIncomeRealtime(state, action) {
      const updated = action.payload
      state.incomes = state.incomes.map((i) => (i.id === updated.id ? updated : i))
    },
    deleteIncomeRealtime(state, action) {
      const id = action.payload
      state.incomes = state.incomes.filter((i) => i.id !== id)
    },

    updateBudgetRealtime(state, action) {
      const updated = action.payload
      state.budgets = state.budgets.map((b) => (b.id === updated.id ? updated : b))
    },

    addGoalRealtime(state, action) {
      state.goals.unshift(action.payload)
    },
    updateGoalRealtime(state, action) {
      const updated = action.payload
      state.goals = state.goals.map((g) => (g.id === updated.id ? updated : g))
    },
    deleteGoalRealtime(state, action) {
      const id = action.payload
      state.goals = state.goals.filter((g) => g.id !== id)
    },

    addGoalContributionRealtime(state, action) {
      state.goalContributions.unshift(action.payload)
    },
    updateGoalContributionRealtime(state, action) {
      const updated = action.payload
      state.goalContributions = state.goalContributions.map((c) => (c.id === updated.id ? updated : c))
    },
    deleteGoalContributionRealtime(state, action) {
      const id = action.payload
      state.goalContributions = state.goalContributions.filter((c) => c.id !== id)
    },

    addActivity(state, action) {
      state.activities.unshift(action.payload)
    },

    setOnlineMembers(state, action) {
      state.onlineMembers = action.payload || []
    },
    addOnlineMember(state, action) {
      const member = action.payload
      if (!state.onlineMembers.find((m) => m.id === member.id)) state.onlineMembers.push(member)
    },
    removeOnlineMember(state, action) {
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
