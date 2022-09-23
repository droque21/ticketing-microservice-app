import express from "express"
import "express-async-errors"
import { json } from "body-parser"
import mongoose from "mongoose"

import { currentUserRouter, signInRouter, signOutRouter, signUpRouter } from "./routes"

import { errorHandler } from "./middlewares"
import { NotFoundError } from "./errors"

const app = express()
app.use(json())

app.use(signUpRouter)
app.use(signInRouter)
app.use(signOutRouter)
app.use(currentUserRouter)

app.all("*", async (req, res, next) => {
  throw new NotFoundError()
})

app.use(errorHandler)

const start = async () => {
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth")
    console.log("Connected to MongoDB")
  } catch (error) {
    console.error(error)
  }
  app.listen(3000, () => {
    console.log("Auth service running!")
  })
}

start()
