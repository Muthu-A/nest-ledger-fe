import { useEffect, useRef } from 'react'
import { createSocket, disconnectSocket, on, off, joinFamilyRoom } from '../socket/socket'
import { EVENTS } from '../socket/socketEvents'

type HandlersMap = Record<string, (...args: unknown[]) => void>

export function useSocket({ url, token, familyId, handlers = {} }: { url?: string; token?: string; familyId?: string; handlers?: HandlersMap } = {}) {
  const handlersRef = useRef<HandlersMap>(handlers)
  handlersRef.current = handlers

  useEffect(() => {
    if (!url || !token) return undefined

    const socket = createSocket(url, token)

    if (familyId) {
      if (socket && (socket as { connected?: boolean }).connected) {
        joinFamilyRoom(familyId)
      } else {
        const onConnect = () => {
          joinFamilyRoom(familyId)
          off('connect', onConnect)
        }
        on('connect', onConnect)
      }
    }

    const registered: Array<[string, (...args: unknown[]) => void]> = []
    for (const [event, handler] of Object.entries(handlersRef.current || {})) {
      if (typeof handler === 'function') {
        on(event, handler)
        registered.push([event, handler])
      }
    }

    return () => {
      for (const [event, handler] of registered) {
        try {
          off(event, handler)
        } catch (e) {}
      }
      disconnectSocket()
    }
  }, [url, token, familyId])
}

export default useSocket
