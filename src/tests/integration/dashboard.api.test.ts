// @ts-nocheck
import request from 'supertest'
import app from '../../../server.cjs'

describe('Dashboard API', () => {
  test('GET /api/dashboard/summary returns totals', async () => {
    const res = await request(app).get('/api/dashboard/summary')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('totalIncome')
    expect(res.body).toHaveProperty('totalExpenses')
    expect(res.body).toHaveProperty('balance')
  })

  test('GET /api/dashboard/recent returns list', async () => {
    const res = await request(app).get('/api/dashboard/recent')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.recentTransactions || res.body)).toBe(true)
  })
})
