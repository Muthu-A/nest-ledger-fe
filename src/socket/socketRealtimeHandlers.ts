import { EVENTS } from './socketEvents'
import {
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
} from '../redux/slices/realtimeSlice'
import { on, off } from './socket'
import { getCurrentRoute } from '../utils/routeTracker'
import { executeRefetchActions } from '../utils/socketRefetchConfig'
import type { AppDispatch } from '../redux/store'

export function registerRealtimeHandlers(dispatch: AppDispatch) {
  if (!dispatch) return () => {}

  const handlers: Record<string, (...args: any[]) => void> = {
    [EVENTS.EXPENSE_CREATED]: (payload: any) => {
      dispatch(addExpenseRealtime(payload))
      executeRefetchActions(EVENTS.EXPENSE_CREATED, getCurrentRoute())
    },
    [EVENTS.EXPENSE_UPDATED]: (payload: any) => {
      dispatch(updateExpenseRealtime(payload))
      executeRefetchActions(EVENTS.EXPENSE_UPDATED, getCurrentRoute())
    },
    [EVENTS.EXPENSE_DELETED]: (payload: any) => {
      dispatch(deleteExpenseRealtime(payload))
      executeRefetchActions(EVENTS.EXPENSE_DELETED, getCurrentRoute())
    },

    [EVENTS.INCOME_CREATED]: (payload: any) => {
      dispatch(addIncomeRealtime(payload))
      executeRefetchActions(EVENTS.INCOME_CREATED, getCurrentRoute())
    },
    [EVENTS.INCOME_UPDATED]: (payload: any) => {
      dispatch(updateIncomeRealtime(payload))
      executeRefetchActions(EVENTS.INCOME_UPDATED, getCurrentRoute())
    },
    [EVENTS.INCOME_DELETED]: (payload: any) => {
      dispatch(deleteIncomeRealtime(payload))
      executeRefetchActions(EVENTS.INCOME_DELETED, getCurrentRoute())
    },

    [EVENTS.BUDGET_CREATED]: (payload: any) => {
      dispatch(updateBudgetRealtime(payload))
      executeRefetchActions(EVENTS.BUDGET_CREATED, getCurrentRoute())
    },
    [EVENTS.BUDGET_UPDATED]: (payload: any) => {
      dispatch(updateBudgetRealtime(payload))
      executeRefetchActions(EVENTS.BUDGET_UPDATED, getCurrentRoute())
    },
    [EVENTS.BUDGET_DELETED]: (payload: any) => {
      dispatch(updateBudgetRealtime(payload))
      executeRefetchActions(EVENTS.BUDGET_DELETED, getCurrentRoute())
    },

    [EVENTS.GOAL_CREATED]: (payload: any) => {
      dispatch(addGoalRealtime(payload))
      executeRefetchActions(EVENTS.GOAL_CREATED, getCurrentRoute())
    },
    [EVENTS.GOAL_UPDATED]: (payload: any) => {
      dispatch(updateGoalRealtime(payload))
      executeRefetchActions(EVENTS.GOAL_UPDATED, getCurrentRoute())
    },
    [EVENTS.GOAL_DELETED]: (payload: any) => {
      dispatch(deleteGoalRealtime(payload))
      executeRefetchActions(EVENTS.GOAL_DELETED, getCurrentRoute())
    },

    [EVENTS.GOAL_CONTRIBUTION_ADDED]: (payload: any) => {
      dispatch(addGoalContributionRealtime(payload))
      executeRefetchActions(EVENTS.GOAL_CONTRIBUTION_ADDED, getCurrentRoute())
    },
    [EVENTS.GOAL_CONTRIBUTION_UPDATED]: (payload: any) => {
      dispatch(updateGoalContributionRealtime(payload))
      executeRefetchActions(EVENTS.GOAL_CONTRIBUTION_UPDATED, getCurrentRoute())
    },
    [EVENTS.GOAL_CONTRIBUTION_DELETED]: (payload: any) => {
      dispatch(deleteGoalContributionRealtime(payload))
      executeRefetchActions(EVENTS.GOAL_CONTRIBUTION_DELETED, getCurrentRoute())
    },

    [EVENTS.ACTIVITY_CREATED]: (payload: any) => dispatch(addActivity(payload)),

    [EVENTS.FAMILY_ONLINE_MEMBERS]: (payload: any) => dispatch(setOnlineMembers(payload)),
    [EVENTS.USER_ONLINE]: (payload: any) => dispatch(addOnlineMember(payload)),
    [EVENTS.USER_OFFLINE]: (payload: any) => dispatch(removeOnlineMember(payload?.id || payload)),
  }

  Object.entries(handlers).forEach(([event, handler]) => on(event, handler))

  return () => {
    Object.entries(handlers).forEach(([event, handler]) => off(event, handler))
    Object.keys(handlers).forEach((ev) => off(ev))
  }
}

export default registerRealtimeHandlers
