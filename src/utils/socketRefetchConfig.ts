import { EVENTS } from '../socket/socketEvents'
import type { Income } from '../types/income'
import type { Expense } from '../types/expense'
import { incomeService } from '../services/incomeService'
import { expenseService } from '../services/expenseService'
import { dashboardService } from '../services/dashboardService'
import { goalService } from '../services/goalService'
import { budgetService } from '../services/budgetService'
import { reportService } from '../services/reportService'
import { getCurrentMonth } from './monthTracker'

/**
 * Configuration for socket events and which APIs need to be refetched
 * based on the current route
 */

type RefetchAction = {
  label: string
  fn: () => Promise<any>
}

/**
 * Maps socket events to required refetch actions per route
 * This ensures that when a socket event is received, the appropriate
 * APIs are called based on what page the user is currently viewing
 */
export const socketRefetchConfig: Record<string, Record<string, RefetchAction[]>> = {
  // When EXPENSE is created/updated/deleted
  [EVENTS.EXPENSE_CREATED]: {
    '/dashboard': [
      { label: 'summary', fn: () => dashboardService.getSummary(getCurrentMonth()) },
      { label: 'recent', fn: () => dashboardService.getRecent(getCurrentMonth()) },
      { label: 'monthly-expenses', fn: () => dashboardService.getMonthlyExpenses() },
    ],
    '/expenses': [
      { label: 'expenses-list', fn: () => expenseService.getAll(getCurrentMonth()) },
    ],
    '/reports': [
      { label: 'reports', fn: () => reportService.getAll() },
    ],
    '/budget': [
      { label: 'budget-list', fn: () => budgetService.getBudgetList(getCurrentMonth()) },
      { label: 'budget-summary', fn: () => budgetService.getBudgetSummary(getCurrentMonth()) },
    ],
  },

  [EVENTS.EXPENSE_UPDATED]: {
    '/dashboard': [
      { label: 'summary', fn: () => dashboardService.getSummary(getCurrentMonth()) },
      { label: 'recent', fn: () => dashboardService.getRecent(getCurrentMonth()) },
      { label: 'monthly-expenses', fn: () => dashboardService.getMonthlyExpenses() },
    ],
    '/expenses': [
      { label: 'expenses-list', fn: () => expenseService.getAll(getCurrentMonth()) },
    ],
    '/reports': [
      { label: 'reports', fn: () => reportService.getAll() },
    ],
    '/budget': [
      { label: 'budget-list', fn: () => budgetService.getBudgetList(getCurrentMonth()) },
      { label: 'budget-summary', fn: () => budgetService.getBudgetSummary(getCurrentMonth()) },
    ],
  },

  [EVENTS.EXPENSE_DELETED]: {
    '/dashboard': [
      { label: 'summary', fn: () => dashboardService.getSummary(getCurrentMonth()) },
      { label: 'recent', fn: () => dashboardService.getRecent(getCurrentMonth()) },
      { label: 'monthly-expenses', fn: () => dashboardService.getMonthlyExpenses() },
    ],
    '/expenses': [
      { label: 'expenses-list', fn: () => expenseService.getAll(getCurrentMonth()) },
    ],
    '/reports': [
      { label: 'reports', fn: () => reportService.getAll() },
    ],
    '/budget': [
      { label: 'budget-list', fn: () => budgetService.getBudgetList(getCurrentMonth()) },
      { label: 'budget-summary', fn: () => budgetService.getBudgetSummary(getCurrentMonth()) },
    ],
  },

  // When INCOME is created/updated/deleted
  [EVENTS.INCOME_CREATED]: {
    '/dashboard': [
      { label: 'summary', fn: () => dashboardService.getSummary(getCurrentMonth()) },
      { label: 'recent', fn: () => dashboardService.getRecent(getCurrentMonth()) },
    ],
    '/income': [
      { label: 'income-list', fn: () => incomeService.getAll(getCurrentMonth()) },
    ],
    '/reports': [
      { label: 'reports', fn: () => reportService.getAll() },
    ],
    '/budget': [
      { label: 'budget-list', fn: () => budgetService.getBudgetList(getCurrentMonth()) },
      { label: 'budget-summary', fn: () => budgetService.getBudgetSummary(getCurrentMonth()) },
    ],
  },

  [EVENTS.INCOME_UPDATED]: {
    '/dashboard': [
      { label: 'summary', fn: () => dashboardService.getSummary(getCurrentMonth()) },
      { label: 'recent', fn: () => dashboardService.getRecent(getCurrentMonth()) },
    ],
    '/income': [
      { label: 'income-list', fn: () => incomeService.getAll(getCurrentMonth()) },
    ],
    '/reports': [
      { label: 'reports', fn: () => reportService.getAll() },
    ],
    '/budget': [
      { label: 'budget-list', fn: () => budgetService.getBudgetList(getCurrentMonth()) },
      { label: 'budget-summary', fn: () => budgetService.getBudgetSummary(getCurrentMonth()) },
    ],
  },

  [EVENTS.INCOME_DELETED]: {
    '/dashboard': [
      { label: 'summary', fn: () => dashboardService.getSummary(getCurrentMonth()) },
      { label: 'recent', fn: () => dashboardService.getRecent(getCurrentMonth()) },
    ],
    '/income': [
      { label: 'income-list', fn: () => incomeService.getAll(getCurrentMonth()) },
    ],
    '/reports': [
      { label: 'reports', fn: () => reportService.getAll() },
    ],
    '/budget': [
      { label: 'budget-list', fn: () => budgetService.getBudgetList(getCurrentMonth()) },
      { label: 'budget-summary', fn: () => budgetService.getBudgetSummary(getCurrentMonth()) },
    ],
  },

  // When BUDGET is created/updated/deleted
  [EVENTS.BUDGET_UPDATED]: {
    '/dashboard': [
      { label: 'summary', fn: () => dashboardService.getSummary(getCurrentMonth()) },
    ],
    '/budget': [
      { label: 'budget-list', fn: () => budgetService.getBudgetList(getCurrentMonth()) },
    ],
  },

  [EVENTS.BUDGET_CREATED]: {
    '/dashboard': [
      { label: 'summary', fn: () => dashboardService.getSummary(getCurrentMonth()) },
    ],
    '/budget': [
      { label: 'budget-list', fn: () => budgetService.getBudgetList(getCurrentMonth()) },
    ],
  },

  [EVENTS.BUDGET_DELETED]: {
    '/dashboard': [
      { label: 'summary', fn: () => dashboardService.getSummary(getCurrentMonth()) },
    ],
    '/budget': [
      { label: 'budget-list', fn: () => budgetService.getBudgetList(getCurrentMonth()) },
    ],
  },

  // When GOAL is created/updated/deleted
  [EVENTS.GOAL_CREATED]: {
    '/dashboard': [
      { label: 'summary', fn: () => dashboardService.getSummary(getCurrentMonth()) },
    ],
    '/goals': [
      { label: 'goals-list', fn: () => goalService.getAllGoals() },
    ],
  },

  [EVENTS.GOAL_UPDATED]: {
    '/dashboard': [
      { label: 'summary', fn: () => dashboardService.getSummary(getCurrentMonth()) },
    ],
    '/goals': [
      { label: 'goals-list', fn: () => goalService.getAllGoals() },
    ],
  },

  [EVENTS.GOAL_DELETED]: {
    '/dashboard': [
      { label: 'summary', fn: () => dashboardService.getSummary(getCurrentMonth()) },
    ],
    '/goals': [
      { label: 'goals-list', fn: () => goalService.getAllGoals() },
    ],
  },

  // When GOAL CONTRIBUTION is added/updated/deleted
  [EVENTS.GOAL_CONTRIBUTION_ADDED]: {
    '/dashboard': [
      { label: 'summary', fn: () => dashboardService.getSummary(getCurrentMonth()) },
    ],
    '/goals': [
      { label: 'goals-list', fn: () => goalService.getAllGoals() },
    ],
  },

  [EVENTS.GOAL_CONTRIBUTION_UPDATED]: {
    '/dashboard': [
      { label: 'summary', fn: () => dashboardService.getSummary(getCurrentMonth()) },
    ],
    '/goals': [
      { label: 'goals-list', fn: () => goalService.getAllGoals() },
    ],
  },

  [EVENTS.GOAL_CONTRIBUTION_DELETED]: {
    '/dashboard': [
      { label: 'summary', fn: () => dashboardService.getSummary(getCurrentMonth()) },
    ],
    '/goals': [
      { label: 'goals-list', fn: () => goalService.getAllGoals() },
    ],
  },
}

/**
 * Get the refetch actions for a specific event and route
 */
export function getRefetchActionsForRoute(event: string, route: string): RefetchAction[] {
  const eventConfig = socketRefetchConfig[event]
  if (!eventConfig) return []
  return eventConfig[route] || []
}

/**
 * Execute all refetch actions for a given event and route
 */
export async function executeRefetchActions(event: string, route: string) {
  let actions = getRefetchActionsForRoute(event, route)
  
  // Always refetch critical dashboard APIs for major events
  // This ensures data is fresh even if route tracking fails
  const majorEvents = [
    EVENTS.EXPENSE_CREATED, EVENTS.EXPENSE_UPDATED, EVENTS.EXPENSE_DELETED, 
    EVENTS.INCOME_CREATED, EVENTS.INCOME_UPDATED, EVENTS.INCOME_DELETED
  ]
  
  if (majorEvents.includes(event)) {
    actions = [...actions, { label: 'summary-fallback', fn: () => dashboardService.getSummary(getCurrentMonth()) }]
  }

  if (actions.length === 0) {
    return
  }

  // Execute all refetch actions in parallel
  try {
    await Promise.all(actions.map(action => 
      action.fn().catch(err => {
        console.error(`Failed to refetch "${action.label}":`, err)
      })
    ))
  } catch (error) {
    console.error('Error executing refetch actions:', error)
  }
}
