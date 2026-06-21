import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RealtimeProvider } from './context/RealtimeContext'

const queryClient = new QueryClient()

// Socket/Realtime connection is handled by `RealtimeProvider` to keep state inside React.

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RealtimeProvider>
            <App />
          </RealtimeProvider>
        </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
