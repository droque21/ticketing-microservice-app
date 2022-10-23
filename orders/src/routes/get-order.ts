import { NotAuthorizedError, NotFoundError } from '@drtitik/common';
import express from 'express';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders/:orderId', async (req, res) => {
  const order = await Order.findById(req.params.orderId).populate('ticket');

  if (!order) {
    throw new NotFoundError("This order doesn't exist");
  }

  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  res.send(order);
});

export { router as getOrderRouter };