# Route-Aware Socket Event Handling System

## Overview

This system enables **context-aware API refetching** based on socket events and the user's current page location. When another user makes changes (e.g., adds/updates income or expenses), the app automatically refetches relevant APIs based on what page the current user is viewing.

## Architecture

### Components Created

1. **RouteContext** (`src/context/RouteContext.tsx`)
   - Tracks the current route/page path
   - Provides `useCurrentRoute()` hook for accessing current path
   - Updates global route tracker when route changes

2. **Route Tracker** (`src/utils/routeTracker.ts`)
   - Global state for current route
   - Used by socket handlers to know current page without React context
   - Functions: `getCurrentRoute()`, `setCurrentRoute(path)`, `initializeRouteTracker(path)`

3. **Socket Refetch Config** (`src/utils/socketRefetchConfig.ts`)
   - Configuration mapping: `event + route → API calls to refetch`
   - Defines which APIs should be called for each socket event on each page
   - Provides `executeRefetchActions(event, route)` function to trigger refetches

4. **Updated Socket Handlers** (`src/socket/socketRealtimeHandlers.ts`)
   - Modified to call `executeRefetchActions()` when events occur
   - Passes current route to determine which APIs to refetch

## How It Works

### Example: User 2 updates expense while User 1 is on Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│ User 2: Updates Expense                                     │
│ → Socket emits: EXPENSE_UPDATED event                       │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ↓
┌──────────────────────────────────────────────────────────────┐
│ User 1's App receives socket event                          │
│ → Get Current Route: '/dashboard'                           │
│ → Look up refetch config for EXPENSE_UPDATED + /dashboard   │
└──────────────────┬───────────────────────────────────────────┘
                   │
                   ↓
┌──────────────────────────────────────────────────────────────┐
│ Execute parallel refetch actions:                           │
│ ✓ dashboardService.getSummary()                            │
│ ✓ dashboardService.getRecent()                             │
│ ✓ dashboardService.getMonthlyExpenses()                    │
└──────────────────────────────────────────────────────────────┘
                   │
                   ↓
┌──────────────────────────────────────────────────────────────┐
│ UI Updates with fresh data                                  │
└──────────────────────────────────────────────────────────────┘
```

## Configuration Mapping

The `socketRefetchConfig` object defines API calls for each event + route combination:

```typescript
socketRefetchConfig[EVENTS.EXPENSE_UPDATED] = {
  '/dashboard': [
    { label: 'summary', fn: () => dashboardService.getSummary() },
    { label: 'recent', fn: () => dashboardService.getRecent() },
    { label: 'monthly-expenses', fn: () => dashboardService.getMonthlyExpenses() },
  ],
  '/expenses': [
    { label: 'expenses-list', fn: () => expenseService.getAll() },
  ],
  '/reports': [
    { label: 'reports', fn: () => reportService.getAll() },
  ],
}
```

## Supported Events & Routes

### Expense Events
- `EXPENSE_CREATED` / `EXPENSE_UPDATED` / `EXPENSE_DELETED`
- Routes: `/dashboard`, `/expenses`, `/reports`

### Income Events
- `INCOME_CREATED` / `INCOME_UPDATED` / `INCOME_DELETED`
- Routes: `/dashboard`, `/income`, `/reports`

### Budget Events
- `BUDGET_CREATED` / `BUDGET_UPDATED` / `BUDGET_DELETED`
- Routes: `/dashboard`, `/budget`

### Goal Events
- `GOAL_CREATED` / `GOAL_UPDATED` / `GOAL_DELETED`
- `GOAL_CONTRIBUTION_ADDED` / `GOAL_CONTRIBUTION_UPDATED` / `GOAL_CONTRIBUTION_DELETED`
- Routes: `/dashboard`, `/goals`

## Adding New Events/Routes

To add a new route or event mapping:

1. Open `src/utils/socketRefetchConfig.ts`
2. Find the event in `socketRefetchConfig`
3. Add the route key with its refetch actions:

```typescript
[EVENTS.EXPENSE_UPDATED]: {
  '/new-page': [
    { label: 'new-api-name', fn: () => someService.getNewData() },
  ],
  // ... existing routes
}
```

## Debugging

Enable debug logs in console:
- Look for `[Socket Refetch]` messages
- Shows which actions were executed for each event
- Logs failed refetch attempts

Example:
```
[Socket Refetch] Executing 3 refetch actions for event "expense-updated" on route "/dashboard"
```

## Integration Points

### RouteProvider Wrapper
Wrapped in `src/routes/AppRoutes.tsx`:
```tsx
<BrowserRouter>
  <RouteProvider>
    <Routes>...
    </Routes>
  </RouteProvider>
</BrowserRouter>
```

### Socket Handler Registration
Modified in `src/socket/socketRealtimeHandlers.ts`:
```tsx
[EVENTS.EXPENSE_UPDATED]: (payload: any) => {
  dispatch(updateExpenseRealtime(payload))
  executeRefetchActions(EVENTS.EXPENSE_UPDATED, getCurrentRoute())
}
```

## Performance Notes

- Refetch actions run in **parallel** using `Promise.all()`
- Only configured routes trigger refetches (no unnecessary API calls)
- Failed refetch attempts don't break the flow - errors are logged

## Future Enhancements

- [ ] Add caching layer to prevent duplicate refetches
- [ ] Add debouncing for rapid consecutive events
- [ ] Add error retry logic
- [ ] Add user preference for auto-refetch (enable/disable)
