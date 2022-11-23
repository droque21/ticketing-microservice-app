import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

describe('GET /api/orders', () => {
  it('fetch a order by id', async () => {
    const cookie = global.signin();

    const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: 'concert',
      price: 20,
    });

    await ticket.save();

    const { body: order } = await request(app)
      .post('/api/orders')
      .set('Cookie', cookie)
      .send({ ticketId: ticket.id })
      .expect(201);

    const { body: fetchedOrder } = await request(app)
      .get(`/api/orders/${order.id}`)
      .set('Cookie', cookie)
      .expect(200);

    expect(fetchedOrder.id).toEqual(order.id);
  });

  it('returns an error if one user tries to fetch another users order', async () => {
    const cookie = global.signin();

    const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
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
      .get(`/api/orders/${order.id}`)
      .set('Cookie', global.signin())
      .expect(401);
  })
});