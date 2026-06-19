import React, { useEffect, useState } from 'react'
import Modal from '../common/Modal'
import { authService } from '../../services/authService'

export default function VerifyEmailModal({ open, onClose, token }: { open: boolean; onClose: () => void; token?: string }) {
  const [message, setMessage] = useState('Verifying…')

  useEffect(() => {
    if (!open) return
    let mounted = true
    ;(async () => {
      try {
        await authService.verify(token || '')
        if (!mounted) return
        setMessage('Email verified')
      } catch (err) {
        setMessage('Verification failed')
      }
    })()
    return () => { mounted = false }
  }, [open, token])

  if (!open) return null
  return (
    <Modal title="Email verification" onClose={onClose}>
      <p>{message}</p>
    </Modal>
  )
}
