import { Outlet, Navigate, useLocation } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

type Props = {
  requireFamily?: boolean
}

export default function ProtectedRoute({ requireFamily = false }: Props) {
  const auth = useAuth()
  const location = useLocation()
  if (auth.isLoading) return null
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  if (requireFamily && !auth.familyId) {
    return <Navigate to="/family/setup" replace />
  }
  return <Outlet />
}
