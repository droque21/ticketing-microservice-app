import mongoose from "mongoose"
import { app } from "./app"

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined")
  }

  try {
    await mongoose.connect("mongodb://tickets-mongo-srv:27017/auth")
    console.log("Connected to MongoDB")
  } catch (error) {
    console.error(error)
  }
  app.listen(3000, () => {
    console.log("Tickets service running!")
  })
}

start()
