import { useCallback } from 'react'
import { useCurrentRoute } from '../context/RouteContext'
import { executeRefetchActions } from '../utils/socketRefetchConfig'

/**
 * Custom hook that provides socket refetch logic based on current route
 * Handles triggering API refetches when socket events occur
 */
export function useSocketRefetch() {
  const { currentPath } = useCurrentRoute()

  const refetchForEvent = useCallback(
    async (event: string) => {
      await executeRefetchActions(event, currentPath)
    },
    [currentPath]
  )

  return {
    refetchForEvent,
    currentPath,
  }
}
