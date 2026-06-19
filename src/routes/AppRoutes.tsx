import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import LoginPage from '../pages/Login/LoginPage'
import DashboardPage from '../pages/Dashboard/DashboardPage'
import IncomePage from '../pages/Income/IncomePage'
import ExpensePage from '../pages/Expenses/ExpensePage'
import ReportsPage from '../pages/Reports/ReportsPage'
import GoalsPage from '../pages/Goals/GoalsPage'
import BudgetPage from '../pages/Budget/BudgetPlanningPage'
import SignupPage from '../pages/Auth/SignupPage'
import ForgotPasswordPage from '../pages/Auth/ForgotPasswordPage'
import ResetPasswordPage from '../pages/Auth/ResetPasswordPage'
import VerifyEmailPage from '../pages/Auth/VerifyEmailPage'
import FamilySetupPage from '../pages/Family/FamilySetupPage'
import FamilySettingsPage from '../pages/Family/FamilySettingsPage'
import ProtectedRoute from '../components/common/ProtectedRoute'
import FamilyRoute from '../components/common/FamilyRoute'
import useAuth from '../hooks/useAuth'

function PostLoginRedirect() {
  const auth = useAuth()
  console.log('[Routes] PostLoginRedirect auth:', { isAuthenticated: auth.isAuthenticated, familyId: auth.familyId })
  if (auth.isLoading) return null
  if (!auth.isAuthenticated) return <Navigate to="/login" replace />
  return auth.familyId ? <Navigate to="/dashboard" replace /> : <Navigate to="/family/setup" replace />
}

export default function AppRoutes() {
  const auth = useAuth()

  function HomeRedirect() {
    if (auth.isLoading) return null
    if (!auth.isAuthenticated) return <Navigate to="/login" replace />
    return auth.familyId ? <Navigate to="/dashboard" replace /> : <Navigate to="/family/setup" replace />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/post-login" element={<PostLoginRedirect />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot" element={<ForgotPasswordPage />} />
        <Route path="/reset" element={<ResetPasswordPage />} />
        <Route path="/verify" element={<VerifyEmailPage />} />

        {/* family setup - accessible only to authenticated users without a family */}
        <Route element={<ProtectedRoute requireFamily={false} />}>
          <Route path="/family/setup" element={<FamilySetupPage />} />
        </Route>

        {/* protected app routes */}
        <Route element={<ProtectedRoute requireFamily={true} />}>
          <Route path="/" element={<AppLayout />}> 
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="income" element={<IncomePage />} />
            <Route path="goals" element={<GoalsPage />} />
            <Route path="budget" element={<BudgetPage />} />
            <Route path="expenses" element={<ExpensePage />} />
            <Route path="reports" element={<ReportsPage />} />

            {/* family required routes */}
            <Route element={<FamilyRoute />}>
              <Route path="family/settings" element={<FamilySettingsPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
