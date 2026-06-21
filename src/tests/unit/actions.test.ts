// @ts-nocheck
// Reducer-like behavior tests for common actions (add/update/delete transactions)

type Tx = { id: string; amount: number }

function reducer(state: Tx[], action: any) {
  switch (action.type) {
    case 'ADD':
      return [...state, action.payload]
    case 'UPDATE':
      return state.map((t) => (t.id === action.payload.id ? { ...t, ...action.payload } : t))
    case 'DELETE':
      return state.filter((t) => t.id !== action.payload.id)
    default:
      return state
  }
}

describe('Reducer actions (simulated)', () => {
  test('ADD action adds transaction', () => {
    const s: Tx[] = []
    const next = reducer(s, { type: 'ADD', payload: { id: '1', amount: 100 } })
    expect(next).toHaveLength(1)
    expect(next[0].amount).toBe(100)
  })

  test('UPDATE action updates correctly', () => {
    const s: Tx[] = [{ id: '1', amount: 100 }]
    const next = reducer(s, { type: 'UPDATE', payload: { id: '1', amount: 200 } })
    expect(next[0].amount).toBe(200)
  })

  test('DELETE action removes transaction', () => {
    const s: Tx[] = [{ id: '1', amount: 100 }]
    const next = reducer(s, { type: 'DELETE', payload: { id: '1' } })
    expect(next).toHaveLength(0)
  })
})
