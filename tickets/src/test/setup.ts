import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import request from "supertest"
import { app } from "../app"

declare global {
  var signin: () => string[]
}

let mongo: MongoMemoryServer

beforeAll(async () => {
  process.env.JWT_KEY = "asdf"
  mongo = await MongoMemoryServer.create()
  const mongoUri = mongo.getUri()

  await mongoose.connect(mongoUri, {})
})

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections()

  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  if (mongo) {
    await mongo.stop()
  }
  await mongoose.connection.close()
})

global.signin = () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  const token = jwt.sign(
    {
      id,
      email: "test@test.com",
    },
    process.env.JWT_KEY!
  )

  const sessionJSON = JSON.stringify({ jwt: token })

  const base64 = Buffer.from(sessionJSON).toString("base64")

  return [`session=${base64}`]
}
