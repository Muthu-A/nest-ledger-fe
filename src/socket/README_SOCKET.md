Socket Integration (Frontend)
=================================

Files added
- `src/socket/socket.js` — socket.io-client singleton and helpers (`createSocket`, `disconnectSocket`, `joinFamilyRoom`, `on`, `off`).
- `src/socket/socketEvents.js` — centralized event name constants.
- `src/socket/socketRealtimeHandlers.js` — maps socket events to Redux actions and returns a cleanup function.
- `src/hooks/useSocket.js` — React hook to connect/disconnect and register handlers.
- `src/redux/slices/realtimeSlice.js` — Redux Toolkit slice with realtime reducers.

Quick integration guide
-----------------------

1. Install dependency (already added to `package.json`):

```bash
npm install
```

2. Add the `realtime` reducer to your Redux store:

```js
// src/redux/store.js (example)
import { configureStore } from '@reduxjs/toolkit'
import realtimeReducer from '../redux/slices/realtimeSlice'

export const store = configureStore({
  reducer: {
    realtime: realtimeReducer,
    // ...other reducers
  },
})

export default store
```

3. Register realtime handlers once the user logs in and you have `token` + `familyId`.
   Place this in a top-level component (e.g. `App.tsx` or `src/main.tsx`) after login:

```js
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import useSocket from './hooks/useSocket'
import registerRealtimeHandlers from './socket/socketRealtimeHandlers'
import { createSocket, disconnectSocket } from './socket/socket'

function AppRoot({ token, familyId }) {
  const dispatch = useDispatch()

  // register handlers mapping socket events to redux actions
  useEffect(() => {
    if (!token || !familyId) return

    const cleanupRegister = registerRealtimeHandlers(dispatch)

    // connect socket (use URL from env)
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'
    createSocket(API_URL, token)

    return () => {
      cleanupRegister()
      disconnectSocket()
    }
  }, [token, familyId, dispatch])

  return <App />
}
```

Alternatively, use the `useSocket` hook which handles connection and registering handlers automatically:

```js
import { useDispatch } from 'react-redux'
import useSocket from './hooks/useSocket'
import registerRealtimeHandlers from './socket/socketRealtimeHandlers'

function AppRoot({ token, familyId }) {
  const dispatch = useDispatch()

  useSocket({
    url: import.meta.env.VITE_API_URL || 'http://localhost:5001',
    token,
    familyId,
    handlers: {
      // optional inline handlers — but recommended to call registerRealtimeHandlers
    },
  })

  useEffect(() => {
    if (!token || !familyId) return
    const cleanup = registerRealtimeHandlers(dispatch)
    return cleanup
  }, [token, familyId, dispatch])
}
```

Notes & Best Practices
- The `socket.js` module uses a singleton so multiple imports share a single connection.
- `useSocket` will disconnect on unmount. If you mount it in a top-level component it will live for the app lifecycle.
- `registerRealtimeHandlers` registers event listeners that dispatch actions to the `realtime` slice. It returns a cleanup function to remove listeners.
- Avoid refetching APIs on realtime events — reducers should update local state so the UI reflects changes immediately.
- Ensure server emits the same event names defined in `socketEvents.js` and payload shapes match your reducers.
- Secure the socket server to validate JWT tokens during connection.

If you'd like, I can:
- Wire the slice into an example `src/redux/store.js` in this repo.
- Add TypeScript typings for these helpers.
- Add automated tests for `useSocket` behavior.
