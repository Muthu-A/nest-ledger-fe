import './App.css'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './context/AuthContext'
import { OfflinePage } from './pages/Offline/OfflinePage'
import PWAInstallPrompt from './components/common/PWAInstallPrompt'

function App() {
  return (
    <AuthProvider>
      <OfflinePage />
      <PWAInstallPrompt />

      <AppRoutes />
    </AuthProvider>
  )
}

export default App
