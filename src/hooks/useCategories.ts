import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '../services/dashboardService'

export function useCategories() {
  return useQuery({
    queryKey: ['dashboard', 'categories'],
    queryFn: () => dashboardService.getCategories(),
    staleTime: 5 * 60_000, // 5 minutes
  })
}
