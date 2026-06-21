import { io, Socket } from 'socket.io-client'
import { EVENTS } from './socketEvents'

let socket: Socket | null = null

export function createSocket(url: string, token?: string) {
  if (socket && socket.connected) return socket

  const opts: any = {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    auth: {
      token,
    },
  }

  socket = io(url, opts)

  socket.on('connect', () => {
    try {
      // log connection info for debugging
      // eslint-disable-next-line no-console
      console.info('[Socket] connected', { id: socket?.id, url })
    } catch (e) {}
  })

  socket.on('connect_error', (err: any) => {
    console.warn('[Socket] connect_error', err?.message || err)
  })

  return socket
}

export function getSocket() {
  return socket
}

export function disconnectSocket() {
  try {
    if (socket) {
      socket.disconnect()
      socket = null
    }
  } catch (e) {
    console.error('Error disconnecting socket', e)
  }
}

export function joinFamilyRoom(familyId: string) {
  if (!socket) return
  socket.emit(EVENTS.JOIN_FAMILY, familyId)
}

export function on(event: string, handler: (...args: any[]) => void) {
  if (!socket) return
  socket.on(event, handler)
}

export function off(event: string, handler?: (...args: any[]) => void) {
  if (!socket) return
  if (handler) socket.off(event, handler)
  else socket.removeAllListeners(event)
}

export function once(event: string, handler: (...args: any[]) => void) {
  if (!socket) return
  socket.once(event, handler)
}

export default {
  createSocket,
  getSocket,
  disconnectSocket,
  joinFamilyRoom,
  on,
  off,
  once,
}
