import React, { useState } from 'react'
import AuthForm from '../../components/common/AuthForm'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

export default function SignupPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(data: any) {
    setError(null)
    if (data.password !== data.confirm) return setError('Passwords do not match')
    if (!data.agree) return setError('You must agree to terms')
    try {
      await auth.signup(data.name, data.email, data.password)
      navigate('/family/setup')
    } catch (err: any) {
      setError(err.message || 'Signup failed')
    }
  }

  return (
    <section className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Create account</h1>
      {error && <p className="text-red-600">{error}</p>}
      <AuthForm mode="signup" onSubmit={handleSubmit} loading={auth.loading} />
    </section>
  )
}
