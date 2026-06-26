import './App.css'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './context/AuthContext'
import { OfflinePage } from './pages/Offline/OfflinePage'
import PWAInstallPrompt from './components/common/PWAInstallPrompt'

function App() {
  window.addEventListener("beforeinstallprompt", (e) => {
  console.log("🔥 beforeinstallprompt fired", e);
});
  return (
    <AuthProvider>
      <OfflinePage />
      <PWAInstallPrompt />

      <AppRoutes />
    </AuthProvider>
  )
}

export default App
