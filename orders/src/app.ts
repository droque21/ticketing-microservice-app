import { json } from "body-parser"
import cookieSession from "cookie-session"
import express from "express"
import "express-async-errors"

import { currentUser, errorHandler, NotFoundError } from "@drtitik/common"
import { createOrderRouter, deleteOrderRouter, getOrderRouter, getOrdersRouter } from "./routes"

const app = express()
app.set("trust proxy", true)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
)

app.use(currentUser)

app.use(getOrdersRouter)
app.use(createOrderRouter)
app.use(deleteOrderRouter)
app.use(getOrderRouter)

app.all("*", async (req, res, next) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
