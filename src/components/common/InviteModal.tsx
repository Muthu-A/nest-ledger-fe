import React, { useState } from 'react'
import Modal from './Modal'
import Button from './Button'

type Props = {
  open: boolean
  onClose: () => void
  onInvite: (email: string) => Promise<void>
}

export default function InviteModal({ open, onClose, onInvite }: Props) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e?: React.FormEvent) {
    e?.preventDefault()
    setLoading(true)
    try {
      await onInvite(email)
      setEmail('')
      onClose()
    } catch (err) {
      // swallow for now
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null
  return (
    <Modal title="Invite member" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm">Email</label>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="flex justify-end space-x-2">
          <button type="button" className="button secondary" onClick={onClose}>Cancel</button>
          <Button text="Send invite" onClick={submit as any} loading={loading} />
        </div>
      </form>
    </Modal>
  )
}
