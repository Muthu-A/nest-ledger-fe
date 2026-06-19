import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

export default function JoinFamilyPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!code.trim()) return setError('Invitation code is required')
    setLoading(true)
    try {
      await auth.joinFamily(code.trim())
      navigate('/dashboard')
    } catch (err: any) {
      setError(err?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Join Family</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Invitation code</label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mt-1 block w-full border rounded p-2"
            placeholder="Enter invitation code"
            required
          />
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <div className="flex gap-2">
          <button type="button" className="px-4 py-2 border rounded" onClick={() => navigate('/family/setup')}>
            Back
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>
            {loading ? 'Joining…' : 'Join Family'}
          </button>
        </div>
      </form>
    </div>
  )
}
