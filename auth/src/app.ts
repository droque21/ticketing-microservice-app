import express from "express"
import "express-async-errors"
import { json } from "body-parser"
import cookieSession from "cookie-session"

import { currentUserRouter, signInRouter, signOutRouter, signUpRouter } from "./routes"

import { errorHandler } from "./middlewares"
import { NotFoundError } from "./errors"

const app = express()
app.set("trust proxy", true)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
)

app.use(signUpRouter)
app.use(signInRouter)
app.use(signOutRouter)
app.use(currentUserRouter)

app.all("*", async (req, res, next) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
