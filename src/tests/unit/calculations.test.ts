// @ts-nocheck

import {
  totalIncome,
  totalExpenses,
  remainingBalance,
  categorySpending,
  percentageDistribution,
  validateAmount,
} from '../../utils/calculations'

describe('Calculations utilities', () => {
  test('totalIncome sums amounts correctly including decimals', () => {
    const incomes = [{ amount: 1000 }, { amount: 2500.5 }, { amount: '500' as any }]
    expect(totalIncome(incomes as any)).toBeCloseTo(4000.5)
  })

  test('totalExpenses sums correctly', () => {
    const expenses = [{ amount: 200 }, { amount: 300.25 }]
    expect(totalExpenses(expenses as any)).toBeCloseTo(500.25)
  })

  test('remainingBalance = income - expenses', () => {
    const incomes = [{ amount: 2000 }, { amount: 1500 }]
    const expenses = [{ amount: 500 }, { amount: 800 }]
    expect(remainingBalance(incomes as any, expenses as any)).toBe(2200)
  })

  test('categorySpending groups by category', () => {
    const expenses = [
      { amount: 100, category: 'food' },
      { amount: 200, category: 'rent' },
      { amount: 50, category: 'food' },
    ]
    const grouped = categorySpending(expenses as any)
    expect(grouped.food).toBe(150)
    expect(grouped.rent).toBe(200)
  })

  test('percentageDistribution computes percentages and handles zero total', () => {
    const items = { food: 150, rent: 350 }
    const pct = percentageDistribution(items)
    expect(pct.food + pct.rent).toBeCloseTo(100)

    const zeros = percentageDistribution({ a: 0, b: 0 })
    expect(zeros.a).toBe(0)
    expect(zeros.b).toBe(0)
  })

  test('validateAmount rejects negatives and non-numbers', () => {
    expect(validateAmount(-10).valid).toBe(false)
    expect(validateAmount('abc').valid).toBe(false)
    expect(validateAmount(100).valid).toBe(true)
  })
})
