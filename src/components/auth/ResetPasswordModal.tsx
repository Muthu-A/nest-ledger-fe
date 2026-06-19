import React, { useState } from 'react'
import Modal from '../common/Modal'
import Button from '../common/Button'
import { authService } from '../../services/authService'

export default function ResetPasswordModal({ open, onClose, token }: { open: boolean; onClose: () => void; token?: string }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (!open) return null

  async function submit(e?: React.FormEvent) {
    e?.preventDefault()
    if (password !== confirm) return setMessage('Passwords do not match')
    setLoading(true)
    try {
      await authService.reset(email, password)
      setMessage('Password reset successful')
    } catch (err: any) {
      setMessage(err.message || 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title="Reset password" onClose={onClose}>
      {message && <p className="text-sm text-muted">{message}</p>}
      <form onSubmit={submit} className="space-y-4">
         <div>
          <label className="block text-sm">Email</label>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm">New password</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm">Confirm password</label>
          <input className="input" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        <div className="flex justify-end">
          <Button text="Reset password" onClick={submit as any} loading={loading} />
        </div>
      </form>
    </Modal>
  )
}
