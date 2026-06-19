import React, { useEffect, useState } from 'react'
import { authService } from '../../services/authService'
import { useLocation, useNavigate } from 'react-router-dom'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export default function VerifyEmailPage() {
  const q = useQuery()
  const token = q.get('token') || ''
  const [message, setMessage] = useState('Verifying…')
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        await authService.verify(token)
        if (!mounted) return
        setMessage('Email verified — redirecting to setup')
        setTimeout(() => navigate('/family/setup'), 1200)
      } catch (err) {
        setMessage('Verification failed')
      }
    })()
    return () => { mounted = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Email verification</h1>
      <p>{message}</p>
    </section>
  )
}
