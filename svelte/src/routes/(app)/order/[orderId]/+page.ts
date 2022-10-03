import { error } from '@sveltejs/kit';
import type { Order } from '$lib/models/order';

/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {
  const order: Order = await new Promise((resolve) => {
    fetch(`http://localhost:8080/order/${params.orderId}`)
      .then(res => res.json())
      .then(data => resolve(data))
      .catch(e => resolve(null));
  });

  if (!order) throw error(404, 'Not found');

  if (order.created)
    order.created = new Date(order.created);
  if (order.requestDate)
    order.requestDate = new Date(order.requestDate);

  order.coupon = undefined;

  return order;
}