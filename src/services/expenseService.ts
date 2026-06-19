import type { Expense } from '../types/expense'
import { apiGet, apiPost } from './api'

export type ExpenseCreatePayload = Omit<Expense, 'id'>

export const expenseService = {
  getAll(month?: string): Promise<Expense[]> {
    return apiGet<Expense[]>('/expenses', month ? { month } : undefined)
  },

  create(expense: ExpenseCreatePayload): Promise<Expense> {
    return apiPost<Expense>('/expenses', expense)
  },
}
