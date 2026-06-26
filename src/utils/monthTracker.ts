/**
 * Global month tracker for socket event handling
 * Keeps track of the selected month so refetch actions use the correct month
 */

let currentMonth = (() => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
})()

export function setCurrentMonth(month: string) {
  currentMonth = month
}

export function getCurrentMonth(): string {
  return currentMonth
}

export function initializeMonthTracker(monthValue: string) {
  currentMonth = monthValue
}
