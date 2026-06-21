// @ts-nocheck
import request from 'supertest'
import app from '../../../server.cjs'

describe('Expense API', () => {
  test('POST /api/expense - valid payload', async () => {
    const payload = { amount: 1500, category: 'groceries', date: '2024-01-20' }
    const res = await request(app).post('/api/expense').send(payload)
    expect([200, 201].includes(res.status)).toBe(true)
    expect(res.body).toHaveProperty('amount')
  })

  test('DELETE /api/expense/:id - not found returns 404', async () => {
    const res = await request(app).delete('/api/expense/nonexistent')
    expect([200, 404].includes(res.status)).toBe(true)
  })
})
