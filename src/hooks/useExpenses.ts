import { useEffect, useState } from 'react'
import { expenseService } from '../services/expenseService'
import { useMonth } from '../context/MonthContext'
import type { Expense } from '../types/expense'

export function useExpenses(): { backendExpenses: Expense[]; loading: boolean } {
  const [backendExpenses, setExpenses] = useState<Expense[]>([])
   const [loading, setLoading] = useState(true);
  const { month } = useMonth()

  useEffect(() => {
    let active = true

    async function loadExpenses() {
      try {
        const data = await expenseService.getAll(month)
        if (active) {
          setExpenses(data)
          setLoading(false)
        } 
      } catch {
        setLoading(false)
        if (active) {
          setExpenses([])
        }
      }
    }

    loadExpenses()

    return () => {
      active = false
    }
  }, [])

  return {loading, backendExpenses}
}
