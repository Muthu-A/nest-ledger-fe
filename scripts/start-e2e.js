const { spawn } = require('child_process')
const http = require('http')

function waitFor(url, timeout = 120000, interval = 1000) {
  const start = Date.now()
  return new Promise((resolve, reject) => {
    const check = () => {
      http.get(url, (res) => {
        res.destroy()
        resolve()
      }).on('error', () => {
        if (Date.now() - start > timeout) return reject(new Error('Timeout waiting for ' + url))
        setTimeout(check, interval)
      })
    }
    check()
  })
}

const api = spawn(process.execPath, ['server.cjs'], { stdio: 'inherit' })
const vite = spawn('npm', ['run', 'dev'], { stdio: 'inherit', shell: true })

const cleanup = () => {
  try { api.kill() } catch (e) {}
  try { vite.kill() } catch (e) {}
  process.exit()
}

process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)

;(async () => {
  try {
    const apiUrl = process.env.API_URL || 'http://localhost:5001/api/dashboard/summary'
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'

    console.log('Waiting for API at', apiUrl)
    await waitFor(apiUrl)
    console.log('API ready')

    console.log('Waiting for frontend at', frontendUrl)
    await waitFor(frontendUrl)
    console.log('Frontend ready')

    // keep process alive while child processes run
    process.on('exit', cleanup)
  } catch (err) {
    console.error('Error during startup:', err)
    cleanup()
  }
})()
