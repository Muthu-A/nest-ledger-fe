import React, { createContext, useContext, useMemo, useState, useEffect } from 'react'
import { setCurrentMonth, initializeMonthTracker } from '../utils/monthTracker'

type MonthContextType = {
  month: string
  setMonth: (m: string) => void
}

const MonthContext = createContext<MonthContextType | undefined>(undefined)

function getCurrentMonth(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

export function MonthProvider({ children }: { children: React.ReactNode }) {
  const [month, setMonth] = useState<string>(getCurrentMonth())
  
  // Track month changes for socket refetch
  useEffect(() => {
    setCurrentMonth(month)
  }, [month])

  // Initialize month tracker on first render
  useEffect(() => {
    initializeMonthTracker(month)
  }, [])

  const value = useMemo(() => ({ month, setMonth }), [month])
  return <MonthContext.Provider value={value}>{children}</MonthContext.Provider>
}

export function useMonth() {
  const ctx = useContext(MonthContext)
  if (!ctx) throw new Error('useMonth must be used within MonthProvider')
  return ctx
}

export default MonthContext
