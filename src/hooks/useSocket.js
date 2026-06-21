import { useEffect, useRef } from 'react'
import { createSocket, disconnectSocket, on, off, joinFamilyRoom } from '../socket/socket'
import { EVENTS } from '../socket/socketEvents'

/**
 * useSocket hook
 * - Connects when `token` and `url` provided
 * - Joins family room when `familyId` provided
 * - Registers event handlers map { eventName: handler }
 * - Cleans up listeners on unmount
 *
 * @param {Object} options
 * @param {string} options.url - socket server url
 * @param {string} options.token - jwt token
 * @param {string} options.familyId - family room id to join
 * @param {Object} options.handlers - map of event -> handler
 */
export function useSocket({ url, token, familyId, handlers = {} } = {}) {
  const handlersRef = useRef(handlers)
  handlersRef.current = handlers

  useEffect(() => {
    if (!url || !token) return undefined

    const socket = createSocket(url, token)

    // join family room when ready
    if (familyId) {
      // wait for connect
      if (socket.connected) {
        joinFamilyRoom(familyId)
      } else {
        const onConnect = () => {
          joinFamilyRoom(familyId)
          off('connect', onConnect)
        }
        on('connect', onConnect)
      }
    }

    // register handlers
    const registered = []
    for (const [event, handler] of Object.entries(handlersRef.current || {})) {
      if (typeof handler === 'function') {
        on(event, handler)
        registered.push([event, handler])
      }
    }

    return () => {
      // cleanup handlers
      for (const [event, handler] of registered) {
        try {
          off(event, handler)
        } catch (e) {}
      }
      // disconnect socket
      disconnectSocket()
    }
  }, [url, token, familyId])
}

export default useSocket
