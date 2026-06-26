import React, { createContext, useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { setCurrentRoute, initializeRouteTracker } from '../utils/routeTracker'

type RouteContextValue = {
  currentPath: string
}

const RouteContext = createContext<RouteContextValue | undefined>(undefined)

export function RouteProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const queryClient = useQueryClient()

  useEffect(() => {
    setCurrentRoute(location.pathname)
    // when navigating to dashboard, ensure dashboard queries refetch
    if (location.pathname === '/dashboard') {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    }
  }, [location.pathname, queryClient])

  // Initialize on first render
  useEffect(() => {
    initializeRouteTracker(location.pathname)
  }, [location.pathname])

  return (
    <RouteContext.Provider value={{ currentPath: location.pathname }}>
      {children}
    </RouteContext.Provider>
  )
}

export function useCurrentRoute() {
  const context = useContext(RouteContext)
  if (!context) {
    throw new Error('useCurrentRoute must be used within RouteProvider')
  }
  return context
}
