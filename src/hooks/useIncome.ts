import { useEffect, useState } from 'react'
import { incomeService } from '../services/incomeService'
import { useMonth } from '../context/MonthContext'
import type { Income } from '../types/income'

export function useIncome(): { backendIncome: Income[]; loading: boolean } {
  const [backendIncome, setIncomes] = useState<Income[]>([])
  const [loading, setLoading] = useState(true);
  const { month } = useMonth()

  useEffect(() => {
    let active = true

    async function loadIncome() {
      try {
        const data = await incomeService.getAll(month)
        if (active) {
          setIncomes(data)
          setLoading(false)
        }
      } catch {
        if (active) {
          setIncomes([])
          setLoading(false)
        }
      }
    }

    loadIncome()

    return () => {
      active = false
    }
  }, [])

  return { backendIncome, loading }
}
