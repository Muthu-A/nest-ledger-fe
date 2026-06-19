import type { DashboardSummary, RecentTransaction } from '../types/dashboard'
import { apiGet } from './api'

export const dashboardService = {
  getSummary(month?: string): Promise<DashboardSummary[]> {
    return apiGet<DashboardSummary[]>('/summary', month ? { month } : undefined)
  },

  getRecent(month?: string): Promise<RecentTransaction[]> {
    return apiGet<RecentTransaction[]>('/recent', month ? { month } : undefined)
  },

  getCategories(month?: string): Promise<any[]> {
    return apiGet<any[]>('/categories', month ? { month } : undefined)
  },
  getMonthlyExpenses(year?: string): Promise<any[]> {
    return apiGet<any[]>('/dashboard/monthly-expenses', year ? { year } : undefined)
  },
}
