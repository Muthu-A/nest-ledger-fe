import { useEffect, useState } from 'react'
import { reportService } from '../services/reportService'
import type { Report } from '../types/report'

export function useReports(): Report[] {
  const [reports, setReports] = useState<Report[]>([])

  useEffect(() => {
    let active = true

    async function loadReports() {
      console.log("called");
      
      try {
        const data = await reportService.getAll()
        console.log("data",data);
        
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
