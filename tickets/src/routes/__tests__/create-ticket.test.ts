import request from "supertest"
import { app } from "../../app"
import { Ticket } from "../../models"
import { natsWrapper } from "../../nats-wrapper"

describe("Create Ticket", () => {

  it("has a route handler listening to /api/tickets for post requests", async () => {
    const response = await request(app).post("/api/tickets").send({})
    expect(response.status).not.toEqual(404)
  })

  it("can only be accessed if the user is signed in", async () => {
    await request(app).post("/api/tickets").send({}).expect(401)
  })

  it("returns a status other than 401 if the user is signed in", async () => {
    const cookie = global.signin()
    const response = await request(app).post("/api/tickets").set("Cookie", cookie).send({})
    expect(response.status).not.toEqual(401)
  })

  it("returns an error if an invalid title is provided", async () => {
    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({ title: "", price: 10 })
      .expect(400)
    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({ price: 10 })
      .expect(400)
  })

  it("returns an error if an invalid price is provided", async () => {
    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({ title: "asdf", price: -10 })
      .expect(400)
    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({ title: "asdf" })
      .expect(400)
  })

  it("creates a ticket with valid inputs", async () => {
    let tickets = await Ticket.find({})
    expect(tickets.length).toEqual(0)

    const response = await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({ title: "asdf", price: 20 })

    expect(response.status).toEqual(201)
    expect(response.body.title).toEqual("asdf")
    expect(response.body.price).toEqual(20)

    tickets = await Ticket.find({})
    expect(tickets.length).toEqual(1)
  })

  it("publishes an event", async () => {
    const title = "asdf"

    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({ title, price: 20 })

    expect(natsWrapper.client.publish).toHaveBeenCalled()
  })

})
