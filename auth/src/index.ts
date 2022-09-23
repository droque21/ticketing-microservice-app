import express from "express"
import "express-async-errors"
import { json } from "body-parser"

import { currentUserRouter, signInRouter, signOutRouter, signUpRouter } from "./routes"

import { errorHandler } from "./middlewares"
import { NotFoundError } from "./errors/not-found-error"

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

app.listen(3000, () => {
  console.log("Listening on port 3000!!!!!!!!")
})
