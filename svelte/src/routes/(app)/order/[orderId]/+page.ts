import { error } from '@sveltejs/kit';
import { afetch } from '$lib/http';
import type { Order } from 'global';

/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {
  const order: Order = await new Promise((resolve) => {
    afetch(`http://localhost:8080/order/${params.orderId}`)
      .then((res) => res.json())
      .then((data) => resolve(data))
      .catch((e) => resolve(null));
  });

  if (!order) throw error(404, 'Not found');

  if (order.created) order.created = new Date(order.created);
  if (order.requestDate) order.requestDate = new Date(order.requestDate);

  const orders: Order[] = [];
  orders.push(order);
  return { orders };
}
