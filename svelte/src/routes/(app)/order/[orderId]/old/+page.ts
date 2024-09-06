import { error } from '@sveltejs/kit';
import { afetch, apiUrl } from '$lib/http';
// @ts-ignore
import type { Order } from '@types/global';

/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {
  const order: Order = await new Promise((resolve) => {
    afetch(`${apiUrl}/order/${params.orderId}`, undefined, fetch)
      .then((res) => res.json())
      .then((data) => resolve(data))
      .catch((_) => resolve(null));
  });

  if (!order) throw error(404, 'Not found');

  if (order.created) order.created = new Date(order.created);
  if (order.requestDate) order.requestDate = new Date(order.requestDate);

  const orders: Order[] = [];
  orders.push(order);
  return { orders };
}
