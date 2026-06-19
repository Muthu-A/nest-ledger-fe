import React, { useState } from 'react'
import { authService } from '../../services/authService'
import { useLocation, useNavigate } from 'react-router-dom'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export default function ResetPasswordPage() {
  const q = useQuery()
  const token = q.get('token') || ''
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) return setMessage('Passwords do not match')
    setLoading(true)
    try {
      await authService.reset(token, password)
      navigate('/login')
    } catch (err: any) {
      setMessage(err.message || 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Reset password</h1>
      {message && <p className="text-red-600">{message}</p>}
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm">New password</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm">Confirm password</label>
          <input className="input" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        <div>
          <button className="button primary" disabled={loading}>Reset password</button>
        </div>
      </form>
    </section>
  )
}
