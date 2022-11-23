import { Listener, OrderCreatedEvent, Subjects } from "@drtitik/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const { id, status, userId, version, ticket } = data;

    const order = Order.build({
      id,
      status,
      userId,
      version,
      price: ticket.price,
    });
    await order.save();

    msg.ack();
  }
}