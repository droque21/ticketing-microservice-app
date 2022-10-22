import { Publisher, Subjects, TicketUpdatedEvent } from "@drtitik/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}