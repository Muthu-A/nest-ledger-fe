import React, { useState } from 'react'

type Props = {
  mode: 'login' | 'signup'
  onSubmit: (data: Record<string, any>) => void
  loading?: boolean
}

export default function AuthForm({ mode, onSubmit, loading }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirm, setConfirm] = useState('')
  const [agree, setAgree] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (mode === 'signup') {
      onSubmit({ name, email, password, confirm, agree })
    } else {
      onSubmit({ email, password })
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {mode === 'signup' && (
        <div>
          <label className="block text-sm">Name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
      )}
      <div>
        <label className="block text-sm">Email</label>
        <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm">Password</label>
        <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      {mode === 'signup' && (
        <>
          <div>
            <label className="block text-sm">Confirm Password</label>
            <input className="input" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>
          <label className="inline-flex items-center space-x-2">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
            <span className="text-sm">I agree to the terms</span>
          </label>
        </>
      )}
      <div>
        <button className="button primary" disabled={!!loading}>{mode === 'signup' ? 'Sign up' : 'Log in'}</button>
      </div>
    </form>
  )
}
