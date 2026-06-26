import React, { useEffect, useState } from 'react'
import { Wifi, WifiOff } from 'lucide-react'

export function OfflinePage() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Wifi className="w-12 h-12 text-gray-300" />
            <WifiOff className="w-12 h-12 text-red-500 absolute top-0 left-0" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">No Internet Connection</h1>
        
        <p className="text-gray-600 mb-4">
          You're currently offline, but your latest data is available.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-900">
            <strong>Cached Data Available:</strong>
            <ul className="mt-2 text-left space-y-1 text-blue-800">
              <li>✓ Categories</li>
              <li>✓ Budget Information</li>
              <li>✓ Your Profile</li>
              <li>✓ Goals & Settings</li>
            </ul>
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-amber-900">
            <strong>Live Data (requires connection):</strong>
            <ul className="mt-2 text-left space-y-1 text-amber-800">
              <li>• Expenses & Income</li>
              <li>• Real-time Updates</li>
            </ul>
          </p>
        </div>

        <button
          onClick={() => {
            // Attempt to reconnect
            window.location.reload()
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
        >
          Check Connection
        </button>

        <p className="text-xs text-gray-500 mt-4">
          Reconnect to internet to sync your latest data
        </p>
      </div>
    </div>
  )
}
