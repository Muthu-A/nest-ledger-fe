const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')

let _mongod
let _mongoUri

beforeAll(async () => {
  if (!global.__MONGO_SERVER__) {
    _mongod = await MongoMemoryServer.create()
    global.__MONGO_SERVER__ = _mongod
    global.__MONGO_URI__ = _mongod.getUri()
  }
  _mongoUri = global.__MONGO_URI__ || process.env.MONGO_URI
  await mongoose.connect(_mongoUri)
})

afterAll(async () => {
  await mongoose.disconnect()
  if (global.__MONGO_SERVER__) {
    await global.__MONGO_SERVER__.stop()
    delete global.__MONGO_SERVER__
    delete global.__MONGO_URI__
  }
})

afterEach(async () => {
  const collections = await mongoose.connection.db.collections()
  for (const collection of collections) {
    await collection.deleteMany({})
  }
})
