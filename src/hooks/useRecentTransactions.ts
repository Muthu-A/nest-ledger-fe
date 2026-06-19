import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '../services/dashboardService'

export function useRecentTransactions(month?: string) {
  return useQuery({
    queryKey: ['dashboard', 'recent', month],
    queryFn: () => dashboardService.getRecent(month),
    staleTime: 30_000,
    keepPreviousData: true,
  })
}
