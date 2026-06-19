import type {
  CategoryBreakdownResponse,
  PivotResponse,
  Report,
  ReportSummaryResponse,
  ReportTrendsResponse,
  TopTransactionsResponse,
} from '../types/report'
import { apiGet } from './api'

const DEFAULT_MONTHS = 6

function getDefaultDateRange() {
  const endDate = new Date()
  const startDate = new Date(endDate)
  startDate.setMonth(startDate.getMonth() - DEFAULT_MONTHS)
  return {
    startDate: startDate.toISOString().slice(0, 10),
    endDate: endDate.toISOString().slice(0, 10),
  }
}

export const reportService = {
  getAll(): Promise<Report[]> {
    const { startDate, endDate } = getDefaultDateRange()
    return apiGet<ReportSummaryResponse>('/reports/summary', {
      startDate,
      endDate,
      groupBy: 'month',
    }).then((response) =>
      response.breakdown.map((item) => ({
        month: item.date,
        income: item.income,
        expense: item.expense,
        savings: item.savings,
      }))
    )
  },

  getSummary(startDate: string, endDate: string, groupBy?: 'day' | 'month' | 'category') {
    return apiGet<ReportSummaryResponse>('/reports/summary', {
      startDate,
      endDate,
      groupBy,
    })
  },

  getTrends(startDate: string, endDate: string, interval?: 'day' | 'month') {
    return apiGet<ReportTrendsResponse>('/reports/trends', {
      startDate,
      endDate,
      interval,
    })
  },

  getCategoryBreakdown(
    startDate: string,
    endDate: string,
    type?: 'expense' | 'income' | 'both',
    page?: number,
    limit?: number,
  ) {
    return apiGet<CategoryBreakdownResponse>('/reports/category-breakdown', {
      startDate,
      endDate,
      type,
      page,
      limit,
    })
  },

  getTopTransactions(
    startDate: string,
    endDate: string,
    type?: 'expense' | 'income' | 'both',
    page?: number,
    limit?: number,
  ) {
    return apiGet<TopTransactionsResponse>('/reports/top-transactions', {
      startDate,
      endDate,
      type,
      page,
      limit,
    })
  },

  getPivot(startDate: string, endDate: string, columns?: string) {
    return apiGet<PivotResponse>('/reports/pivot', {
      startDate,
      endDate,
      columns,
    })
  },
}
