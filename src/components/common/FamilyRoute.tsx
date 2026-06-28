import { Outlet, Navigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

export default function FamilyRoute() {
  const auth = useAuth()
  console.log("cameeee",auth);
  
  if (auth.isLoading) return null
  if (!auth.familyId) {
    return <Navigate to="/family/setup" replace />
  }
  return <Outlet />
}
