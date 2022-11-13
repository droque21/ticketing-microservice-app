import { Subjects, OrderCancelledEvent, Publisher } from "@drtitik/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}