export const EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',

  EXPENSE_CREATED: 'expense-created',
  EXPENSE_UPDATED: 'expense-updated',
  EXPENSE_DELETED: 'expense-deleted',

  INCOME_CREATED: 'income-created',
  INCOME_UPDATED: 'income-updated',
  INCOME_DELETED: 'income-deleted',

  BUDGET_CREATED: 'budget-created',
  BUDGET_UPDATED: 'budget-updated',
  BUDGET_DELETED: 'budget-deleted',

  GOAL_CREATED: 'goal-created',
  GOAL_UPDATED: 'goal-updated',
  GOAL_DELETED: 'goal-deleted',

  GOAL_CONTRIBUTION_ADDED: 'goal-contribution-added',
  GOAL_CONTRIBUTION_UPDATED: 'goal-contribution-updated',
  GOAL_CONTRIBUTION_DELETED: 'goal-contribution-deleted',

  ACTIVITY_CREATED: 'activity-created',
  USER_ONLINE: 'user-online',
  USER_OFFLINE: 'user-offline',
  FAMILY_ONLINE_MEMBERS: 'family-online-members',

  JOIN_FAMILY: 'join-family',
} as const

export default EVENTS
