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
  const [parsedText, setParsedText] = useState('')

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
        try {
          setParsedText(JSON.stringify(result, null, 2))
        } catch (e) {
          setParsedText(String(result))
        }
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }, 250)
  }

  async function handleConfirm() {
    if (!parsed) return
    setLoading(true)
    if (onConfirmParsed) {
      try {
        await onConfirmParsed(parsed)
        // show a small success indication
        setTimeout(() => {
          try {
            setParsed(null)
          } catch (e) {}
        }, 250)
      } catch (e) {
        console.error(e)
        setError(String(e))
      } finally {
        setLoading(false)
      }
      onClose()
      return
    }
    // Default behavior: emit a window event so consumers can handle without requiring react-redux Provider
    try {
      window.dispatchEvent(new CustomEvent('voiceCommand', { detail: parsed }))
    } catch (e) {
      console.error('Failed to emit voiceCommand event', e)
      setError('Failed to dispatch voiceCommand event')
    } finally {
      setLoading(false)
      onClose()
    }
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
            <div style={{ marginTop: 6 }}>
              <textarea
                aria-label="Parsed voice JSON"
                value={parsedText}
                onChange={(e) => {
                  const v = e.target.value
                  setParsedText(v)
                  try {
                    const obj = JSON.parse(v)
                    setParsed(obj)
                    setError(null)
                  } catch (err) {
                    // while editing, parsed may be temporarily invalid; keep parsed=null to disable Confirm
                    setParsed(null)
                    setError('Parsed JSON is invalid')
                  }
                }}
                style={{ width: '100%', minHeight: 140, fontFamily: 'monospace', fontSize: 12, padding: 8 }}
              />
            </div>
            {parsed && (parsed.payload == null) && parsed.raw && (
              <div style={{ marginTop: 8 }}>
                <div style={{ marginBottom: 6, color: 'rgba(255,255,255,0.8)' }}>Parser didn't extract structured commands. You can edit the JSON above or</div>
                <button
                  type="button"
                  onClick={() => {
                    const fallback = { module: 'expense', payload: [{ category: String(parsed.raw).trim(), amount: 0 }], raw: parsed.raw }
                    setParsed(fallback)
                    setParsedText(JSON.stringify(fallback, null, 2))
                    setError(null)
                  }}
                  style={{ padding: '6px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', background: '#3b82f6', color: '#fff' }}
                >Use raw text as expense</button>
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
          {!listening ? (
            <Button onClick={startListening} text="Start Recording" disabled={loading} />
          ) : (
            <Button onClick={stopListening} text="Stop Recording" disabled={loading} />
          )}

          <Button onClick={onClose} text="Cancel" disabled={loading} />

          <Button onClick={() => handleConfirm()} text="Confirm" disabled={!parsed || loading} loading={loading} />
        </div>
      </div>
    </Modal>
  )
}

