import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

export default function CreateFamilyPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!name.trim()) return setError('Family name is required')
    setLoading(true)
    try {
      await auth.createFamily(name.trim())
      navigate('/dashboard')
    } catch (err: any) {
      setError(err?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Create Family</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Family name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border rounded p-2"
            placeholder="e.g. The Patels"
            required
          />
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <div className="flex gap-2">
          <button type="button" className="px-4 py-2 border rounded" onClick={() => navigate('/family/setup')}>
            Back
          </button>
          <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded" disabled={loading}>
            {loading ? 'Creating…' : 'Create Family'}
          </button>
        </div>
      </form>
    </div>
  )
}
