export interface Report {
  month: string
  income: number
  expense: number
  savings: number
}

export interface ReportBreakdownItem {
  date: string
  income: number
  expense: number
  savings: number
}

export interface ReportSummaryResponse {
  totalIncome: number
  totalExpense: number
  totalSavings: number
  balance: number
  period: {
    start: string
    end: string
  }
  breakdown: ReportBreakdownItem[]
}

export interface ReportTrendPoint {
  date: string
  income: number
  expense: number
  savings: number
}

export interface ReportTrendsResponse {
  data: ReportTrendPoint[]
}

export interface CategoryBreakdownItem {
  category: string
  amount: number
  percent: number
  color: string
}

export interface CategoryBreakdownResponse {
  breakdown: CategoryBreakdownItem[]
  page: number
  limit: number
  total: number
}

export interface TopTransaction {
  id: string
  date: string
  description: string
  category: string
  amount: number
  type: 'expense' | 'income' | 'both'
}

export interface TopTransactionsResponse {
  transactions: TopTransaction[]
  page: number
  limit: number
  total: number
}

export interface PivotRow {
  category: string
  values: number[]
}

export interface PivotResponse {
  columns: string[]
  rows: PivotRow[]
  totals?: {
    columnTotals: number[]
    rowTotals: number[]
  }
}
