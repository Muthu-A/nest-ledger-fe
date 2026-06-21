// @ts-nocheck
import { formatDate } from '../../utils/helpers'
import { formatCurrency } from '../../utils/currency'

describe('Utils - formatting', () => {
  test('formatDate returns readable date', () => {
    const d = '2024-01-15'
    const out = formatDate(d)
    expect(typeof out).toBe('string')
    expect(out.length).toBeGreaterThan(0)
  })

  test('formatCurrency formats integer values', () => {
    expect(formatCurrency(5000)).toContain('₹')
  })
})
