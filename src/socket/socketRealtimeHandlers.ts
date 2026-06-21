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
import type { AppDispatch } from '../redux/store'

export function registerRealtimeHandlers(dispatch: AppDispatch) {
  if (!dispatch) return () => {}

  const handlers: Record<string, (...args: any[]) => void> = {
    [EVENTS.EXPENSE_CREATED]: (payload: any) => dispatch(addExpenseRealtime(payload)),
    [EVENTS.EXPENSE_UPDATED]: (payload: any) => dispatch(updateExpenseRealtime(payload)),
    [EVENTS.EXPENSE_DELETED]: (payload: any) => dispatch(deleteExpenseRealtime(payload)),

    [EVENTS.INCOME_CREATED]: (payload: any) => dispatch(addIncomeRealtime(payload)),
    [EVENTS.INCOME_UPDATED]: (payload: any) => dispatch(updateIncomeRealtime(payload)),
    [EVENTS.INCOME_DELETED]: (payload: any) => dispatch(deleteIncomeRealtime(payload)),

    [EVENTS.BUDGET_UPDATED]: (payload: any) => dispatch(updateBudgetRealtime(payload)),

    [EVENTS.GOAL_CREATED]: (payload: any) => dispatch(addGoalRealtime(payload)),
    [EVENTS.GOAL_UPDATED]: (payload: any) => dispatch(updateGoalRealtime(payload)),
    [EVENTS.GOAL_DELETED]: (payload: any) => dispatch(deleteGoalRealtime(payload)),

    [EVENTS.GOAL_CONTRIBUTION_ADDED]: (payload: any) => dispatch(addGoalContributionRealtime(payload)),
    [EVENTS.GOAL_CONTRIBUTION_UPDATED]: (payload: any) => dispatch(updateGoalContributionRealtime(payload)),
    [EVENTS.GOAL_CONTRIBUTION_DELETED]: (payload: any) => dispatch(deleteGoalContributionRealtime(payload)),

    [EVENTS.ACTIVITY_CREATED]: (payload: any) => dispatch(addActivity(payload)),

    [EVENTS.FAMILY_ONLINE_MEMBERS]: (payload: any) => dispatch(setOnlineMembers(payload)),
    [EVENTS.USER_ONLINE]: (payload: any) => dispatch(addOnlineMember(payload)),
    [EVENTS.USER_OFFLINE]: (payload: any) => dispatch(removeOnlineMember(payload?.id || payload)),
  }

  Object.entries(handlers).forEach(([event, handler]) => on(event, handler))

  // add lightweight logging for incoming events (can be removed in prod)
  Object.keys(handlers).forEach((ev) => {
    on(ev, (...args: any[]) => {
      try {
        // eslint-disable-next-line no-console
        console.debug('[Socket Event]', ev, args && args.length ? args[0] : null)
      } catch (e) {}
    })
  })

  return () => {
    Object.entries(handlers).forEach(([event, handler]) => off(event, handler))
    Object.keys(handlers).forEach((ev) => off(ev))
  }
}

export default registerRealtimeHandlers
