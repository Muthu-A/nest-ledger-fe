import { useEffect, useState } from 'react'

export type CacheableData = 'categories' | 'profile' | 'goals' | 'budget' | 'settings'
export type LiveData = 'expenses' | 'income' | 'realtime' | 'socket'

interface OfflineState {
  isOnline: boolean
  hasCachedData: (dataType: CacheableData) => boolean
  getCachedData: (dataType: CacheableData) => unknown
  setCachedData: (dataType: CacheableData, data: unknown) => void
  clearCache: () => void
}

const CACHE_KEY_PREFIX = 'nest-ledger-cache:'
const CACHE_METADATA_KEY = 'nest-ledger-cache-metadata'

/**
 * Hook to manage offline state and cached data
 *
 * Cacheable data (works offline):
 * - categories
 * - profile
 * - goals
 * - budget
 * - settings
 *
 * Live data (requires internet):
 * - expenses
 * - income
 * - realtime updates
 * - socket data
 */
export function useOffline(): OfflineState {
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

  const hasCachedData = (dataType: CacheableData): boolean => {
    try {
      const key = `${CACHE_KEY_PREFIX}${dataType}`
      return localStorage.getItem(key) !== null
    } catch {
      return false
    }
  }

  const getCachedData = (dataType: CacheableData): unknown => {
    try {
      const key = `${CACHE_KEY_PREFIX}${dataType}`
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  }

  const setCachedData = (dataType: CacheableData, data: unknown): void => {
    try {
      const key = `${CACHE_KEY_PREFIX}${dataType}`
      localStorage.setItem(key, JSON.stringify(data))

      // Update metadata
      const metadata = (() => {
        try {
          return JSON.parse(localStorage.getItem(CACHE_METADATA_KEY) || '{}')
        } catch {
          return {}
        }
      })()
      metadata[dataType] = new Date().toISOString()
      localStorage.setItem(CACHE_METADATA_KEY, JSON.stringify(metadata))
    } catch (err) {
      console.error(`Failed to cache ${dataType}:`, err)
    }
  }

  const clearCache = (): void => {
    try {
      const cacheableTypes: CacheableData[] = ['categories', 'profile', 'goals', 'budget', 'settings']
      cacheableTypes.forEach((type) => {
        const key = `${CACHE_KEY_PREFIX}${type}`
        localStorage.removeItem(key)
      })
      localStorage.removeItem(CACHE_METADATA_KEY)
    } catch (err) {
      console.error('Failed to clear cache:', err)
    }
  }

  return {
    isOnline,
    hasCachedData,
    getCachedData,
    setCachedData,
    clearCache,
  }
}
