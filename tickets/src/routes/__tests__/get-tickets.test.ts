import mongoose from "mongoose"
import request from "supertest"
import { app } from "../../app"

describe("Get Ticket", () => {
  it("has a route handler listening to /api/tickets for post requests", async () => {
    const response = await request(app).get("/api/tickets").send({})
    expect(response.status).not.toEqual(404)
  })

  it("can fetch a list of tickets", async () => {
    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({ title: "asdf", price: 20 })
      .expect(201)

    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({ title: "asdf", price: 20 })
      .expect(201)

    const response = await request(app).get("/api/tickets").send().expect(200)

    expect(response.body.length).toEqual(2)
  })
})
