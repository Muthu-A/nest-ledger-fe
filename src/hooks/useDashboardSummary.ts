import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '../services/dashboardService'

export function useDashboardSummary(month?: string) {
  return useQuery({
    queryKey: ['dashboard', 'summary', month],
    queryFn: () => dashboardService.getSummary(month),
    staleTime: 60_000,
    keepPreviousData: true,
  })
}
