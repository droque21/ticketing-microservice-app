import express from "express"
import { json } from "body-parser"

import { currentUserRouter, signInRouter, signOutRouter, signUpRouter } from "./routes"

const app = express()
app.use(json())

app.use(signUpRouter)
app.use(signInRouter)
app.use(signOutRouter)
app.use(currentUserRouter)

app.listen(3000, () => {
  console.log("Listening on port 3000!!!!!!!!")
})
