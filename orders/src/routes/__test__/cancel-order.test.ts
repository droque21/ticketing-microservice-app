import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

describe('DELETE /api/orders/:orderId', () => {

  it('marks an order as cancelled', async () => {
    const cookie = global.signin();

    const ticket = Ticket.build({
      title: 'concert',
      price: 20,
    });

    await ticket.save();

    const { body: order } = await request(app)
      .post('/api/orders')
      .set('Cookie', cookie)
      .send({ ticketId: ticket.id })
      .expect(201);

    await request(app)
      .patch(`/api/orders/${order.id}`)
      .set('Cookie', cookie)
      .expect(200);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
  })

  it('emits a order cancelled event', async () => {
    const cookie = global.signin();

    const ticket = Ticket.build({
      title: 'concert',
      price: 20,
    });

    await ticket.save();

    const { body: order } = await request(app)
      .post('/api/orders')
      .set('Cookie', cookie)
      .send({ ticketId: ticket.id })
      .expect(201);

    await request(app)
      .patch(`/api/orders/${order.id}`)
      .set('Cookie', cookie)
      .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  })
})