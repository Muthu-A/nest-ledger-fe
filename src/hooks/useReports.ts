import { useEffect, useState } from 'react'
import { reportService } from '../services/reportService'
import type { Report } from '../types/report'

export function useReports(): Report[] {
  const [reports, setReports] = useState<Report[]>([])

  useEffect(() => {
    let active = true

    async function loadReports() {
      try {
        const data = await reportService.getAll()

        if (active) {
          setReports(data)
        }
      } catch {
        if (active) {
          setReports([])
        }
      }
    }

    loadReports()

    return () => {
      active = false
    }
  }, [])

  return reports
}
