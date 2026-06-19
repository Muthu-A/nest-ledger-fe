import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '../services/dashboardService'

export default function useMonthlyExpenses(year?: string) {
  return useQuery({
    queryKey: ['dashboard', 'monthlyExpenses', year ?? 'current'],
    queryFn: () => dashboardService.getMonthlyExpenses(year),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  })
}
