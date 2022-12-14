import express, { Request, Response } from "express"
import { body } from "express-validator"
import { NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from "@drtitik/common"
import { Ticket } from "../models"
import { TicketUpdatedPublisher } from "../events/publishers/ticketUpdatedPublisher"
import { natsWrapper } from "../nats-wrapper"

const router = express.Router()

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { id } = req.params
    const ticket = await Ticket.findById(id)

    if (!ticket) {
      throw new NotFoundError("Ticket not found")
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    const { title, price } = req.body

    ticket.set({ title, price })
    await ticket.save()

    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    })

    res.send(ticket)
  }
)

export { router as updateTicketRouter }
