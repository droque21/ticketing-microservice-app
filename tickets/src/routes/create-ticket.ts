import { requireAuth, validateRequest } from "@drtitik/common"
import express, { Request, Response } from "express"
import { body } from "express-validator"
import { TicketCreatedPublisher } from "../events"
import { Ticket } from "../models"
import { natsWrapper } from "../nats-wrapper"

const router = express.Router()

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  (req: Request, res: Response) => {
    const { title, price } = req.body

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    })

    ticket.save()

    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    })

    res.status(201).send(ticket)
  }
)

export { router as createTicketRouter }

