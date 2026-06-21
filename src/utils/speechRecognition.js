/**
 * speechRecognition.js
 * Minimal wrapper around Web Speech API to provide start/stop and event hooks.
 */

export function createSpeechRecognizer({ lang = 'en-US', interimResults = true, continuous = false } = {}) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) {
    return {
      supported: false,
      start: () => {
        throw new Error('SpeechRecognition not supported in this browser')
      },
      stop: () => {},
      onResult: () => {},
      onError: () => {},
    }
  }

  const recognizer = new SpeechRecognition()
  recognizer.lang = lang
  recognizer.interimResults = interimResults
  recognizer.continuous = continuous

  let _onResult = () => {}
  let _onError = () => {}
  let _onStart = () => {}
  let _onEnd = () => {}

  recognizer.onresult = (ev) => {
    const results = []
    for (let i = 0; i < ev.results.length; i++) {
      results.push(ev.results[i][0].transcript)
    }
    const transcript = results.join(' ')
    _onResult({ transcript, results: ev.results })
  }

  recognizer.onerror = (e) => {
    _onError(e)
  }

  recognizer.onstart = () => _onStart()
  recognizer.onend = () => _onEnd()

  return {
    supported: true,
    start: () => recognizer.start(),
    stop: () => recognizer.stop(),
    set onResult(fn) {
      _onResult = fn
    },
    set onError(fn) {
      _onError = fn
    },
    set onStart(fn) {
      _onStart = fn
    },
    set onEnd(fn) {
      _onEnd = fn
    },
    instance: recognizer,
  }
}

export default { createSpeechRecognizer }
