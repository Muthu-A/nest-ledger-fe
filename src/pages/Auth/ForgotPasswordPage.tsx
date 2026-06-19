import React, { useState } from 'react'
import { authService } from '../../services/authService'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await authService.forgot(email)
      setMessage('If an account exists, a reset email was sent.')
    } catch (err) {
      setMessage('Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Forgot password</h1>
      {message && <p className="text-sm text-muted">{message}</p>}
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm">Email</label>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <button className="button primary" disabled={loading}>Send reset link</button>
        </div>
      </form>
    </section>
  )
}
