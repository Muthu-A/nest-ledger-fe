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

let mongodInstance = null
let apiEnv = Object.assign({}, process.env)
const { MongoMemoryServer } = require('mongodb-memory-server')

async function maybeStartMongo() {
  if (process.env.MONGO_URI) {
    return null
  }
  const mongod = await MongoMemoryServer.create()
  apiEnv.MONGO_URI = mongod.getUri()
  mongodInstance = mongod
  return mongod
}

let api
let vite

const cleanup = () => {
  try { api.kill() } catch (e) {}
  try { vite.kill() } catch (e) {}
  process.exit()
}

process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)

;(async () => {
  try {
    // start in-memory mongo if MONGO_URI not provided
    await maybeStartMongo()

    api = spawn(process.execPath, ['server.cjs'], { stdio: 'inherit', env: apiEnv })
    vite = spawn('npm', ['run', 'dev'], { stdio: 'inherit', shell: true })

    const apiUrl = process.env.API_URL || apiEnv.API_URL || 'http://localhost:4000/api/dashboard/summary'
    const frontendUrl = process.env.FRONTEND_URL || apiEnv.FRONTEND_URL || 'http://localhost:5173'

    await waitFor(apiUrl)
    await waitFor(frontendUrl)

    // keep process alive while child processes run
    process.on('exit', cleanup)
  } catch (err) {
    console.error('Error during startup:', err)
    cleanup()
  }
})()
