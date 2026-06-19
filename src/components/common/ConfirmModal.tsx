import React from 'react'
import Modal from './Modal'

type Props = {
  open: boolean
  title?: string
  message?: string
  onCancel: () => void
  onConfirm: () => void
}

export default function ConfirmModal({ open, title = 'Confirm', message, onCancel, onConfirm }: Props) {
  if (!open) return null
  return (
    <Modal title={title} onClose={onCancel}>
      <div className="space-y-4">
        <p>{message}</p>
        <div className="flex justify-end space-x-2">
          <button className="button secondary" onClick={onCancel}>Cancel</button>
          <button className="button danger" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </Modal>
  )
}
