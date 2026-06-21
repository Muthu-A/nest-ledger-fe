export function totalIncome(records: Array<{ amount: number }>) {
  return records.reduce((s, r) => s + Number(r.amount || 0), 0)
}

export function totalExpenses(records: Array<{ amount: number }>) {
  return records.reduce((s, r) => s + Number(r.amount || 0), 0)
}

export function remainingBalance(incomes: Array<{ amount: number }>, expenses: Array<{ amount: number }>) {
  return totalIncome(incomes) - totalExpenses(expenses)
}

export function categorySpending(expenses: Array<{ amount: number; category?: string }>) {
  return expenses.reduce((acc: Record<string, number>, e) => {
    const k = e.category || 'Uncategorized'
    acc[k] = (acc[k] || 0) + Number(e.amount || 0)
    return acc
  }, {})
}

export function percentageDistribution(items: Record<string, number>) {
  const keys = Object.keys(items)
  const total = keys.reduce((s: number, k: string) => s + (items[k] || 0), 0)
  if (total === 0) return keys.reduce((acc: Record<string, number>, k: string) => { acc[k] = 0; return acc }, {})
  const result: Record<string, number> = {}
  for (const k in items) result[k] = Math.round((items[k] / total) * 10000) / 100
  return result
}

export function validateAmount(value: any) {
  const n = Number(value)
  if (Number.isNaN(n)) return { valid: false, reason: 'not-a-number' }
  if (!isFinite(n)) return { valid: false, reason: 'not-finite' }
  if (n < 0) return { valid: false, reason: 'negative' }
  return { valid: true, value: n }
}
