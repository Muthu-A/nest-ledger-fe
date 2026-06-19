export interface DashboardBreakdownItem {
  label: string
  percent: number
  color: string
}

export interface DashboardSummary {
  month: string
  income: number
  expense: number
  savings: number
  balance: number
  breakdown: DashboardBreakdownItem[]
}

export interface RecentTransaction {
  id: string
  category: string
  subCategory: string
  amount: number
  date: string
  notes?: string
}
