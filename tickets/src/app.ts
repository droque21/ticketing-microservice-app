import { json } from "body-parser"
import cookieSession from "cookie-session"
import express from "express"
import "express-async-errors"

import { currentUser, errorHandler, NotFoundError } from "@drtitik/common"
import { createTicketRouter, getTicketRouter, updateTicketRouter } from "./routes"
import { getTicketsRouter } from "./routes/get-tikets"

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

app.use(createTicketRouter)
app.use(getTicketsRouter)
app.use(getTicketRouter)
app.use(updateTicketRouter)

app.all("*", async (req, res, next) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
