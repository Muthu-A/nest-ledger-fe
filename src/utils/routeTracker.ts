/**
 * Global route tracker for socket event handling
 * This allows socket handlers to know which page the user is on
 * without needing to pass context through the entire app
 */

let currentRoute = '/dashboard'

export function setCurrentRoute(path: string) {
  currentRoute = path
}

export function getCurrentRoute(): string {
  return currentRoute
}

export function initializeRouteTracker(initialPath: string) {
  currentRoute = initialPath
}
