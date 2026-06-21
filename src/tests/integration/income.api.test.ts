// @ts-nocheck
/**
 * Integration tests for Income endpoints using Supertest.
 * NOTE: Ensure `server.js` exports the Express `app` as `module.exports = app` or `export default app`.
 * Configure a test database or mock the DB before running these tests.
 */

import request from 'supertest'
// adjust import path if your server entry is different
import app from '../../../server.cjs'

describe('Income API', () => {
  test('POST /api/income - valid payload', async () => {
    const payload = { amount: 5000, category: 'salary', date: '2024-01-15' }
    const res = await request(app).post('/api/income').send(payload)
    expect([200, 201].includes(res.status)).toBe(true)
    expect(res.body).toHaveProperty('amount')
  })

  test('POST /api/income - invalid payload (negative)', async () => {
    const payload = { amount: -5000, category: 'salary', date: '2024-01-15' }
    const res = await request(app).post('/api/income').send(payload)
    expect(res.status).toBe(400)
  })

  test('GET /api/income - returns array', async () => {
    const res = await request(app).get('/api/income')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})
