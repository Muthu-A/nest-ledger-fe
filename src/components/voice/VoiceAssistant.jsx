import React, { useEffect, useRef, useState } from 'react'
import Button from '../common/Button'
import Modal from '../common/Modal'

import { createSpeechRecognizer } from '../../utils/speechRecognition'
import { parseVoiceCommand } from '../../utils/voiceParser'

/**
 * VoiceAssistant component
 * Props:
 * - open: boolean - controls dialog visibility
 * - onClose: function - called when dialog is closed
 * - onConfirmParsed: optional function(parsed) - override default save flow
 */
export default function VoiceAssistant({ open, onClose, onConfirmParsed }) {
  if (!open) return null
  const [listening, setListening] = useState(false)
  const [loading, setLoading] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState(null)
  const [parsed, setParsed] = useState(null)

  const recRef = useRef(null)

  useEffect(() => {
    recRef.current = createSpeechRecognizer({ lang: 'en-US', interimResults: true, continuous: false })
    recRef.current.onResult = ({ transcript: t }) => setTranscript(t)
    recRef.current.onError = (e) => setError(e?.error || e?.message || String(e))
    recRef.current.onEnd = () => setListening(false)
    return () => {
      try {
        recRef.current && recRef.current.stop()
      } catch (e) {}
    }
  }, [])

  function startListening() {
    setError(null)
    setTranscript('')
    setParsed(null)
    try {
      if (!recRef.current || !recRef.current.supported) throw new Error('SpeechRecognition not supported')
      recRef.current.start()
      setListening(true)
    } catch (e) {
      setError(e.message)
    }
  }

  function stopListening() {
    try {
      if (recRef.current && recRef.current.supported) recRef.current.stop()
    } catch (e) {}
    setListening(false)
    setLoading(true)
    // Give a small delay to ensure final result arrives
    setTimeout(() => {
      try {
        const result = parseVoiceCommand(transcript || '')
        setParsed(result)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }, 250)
  }

  async function handleConfirm() {
    if (!parsed) return
    if (onConfirmParsed) {
      try {
        await onConfirmParsed(parsed)
      } catch (e) {
        console.error(e)
      }
      onClose()
      return
    }
    // Default behavior: emit a window event so consumers can handle without requiring react-redux Provider
    try {
      window.dispatchEvent(new CustomEvent('voiceCommand', { detail: parsed }))
    } catch (e) {
      console.error('Failed to emit voiceCommand event', e)
    }
    onClose()
  }

  return (
    <Modal title="Voice Assistant" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <strong>Live transcript</strong>
          <div style={{ minHeight: 64, padding: 8, border: '1px solid rgba(0,0,0,0.08)', borderRadius: 6, marginTop: 8 }}>
            <div>{transcript || '—'}</div>
          </div>
        </div>

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="spinner" style={{ width: 16, height: 16 }} />
            <div>Parsing...</div>
          </div>
        )}

        {error && (
          <div style={{ color: 'var(--danger, #d32f2f)' }}>{String(error)}</div>
        )}

        {parsed && (
          <div>
            <strong>Detected:</strong>
            <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{JSON.stringify(parsed, null, 2)}</pre>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
          {!listening ? (
            <Button onClick={startListening} text="Start Recording" />
          ) : (
            <Button onClick={stopListening} text="Stop Recording" />
          )}

          <Button onClick={onClose} text="Cancel" />

          <Button onClick={handleConfirm} text="Confirm" disabled={!parsed} />
        </div>
      </div>
    </Modal>
  )
}

