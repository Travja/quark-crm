import { error } from '@sveltejs/kit';
import { afetch, apiUrl } from '$lib/http';
import type { Order } from 'global';
import { sanitizeOrder } from '$lib/api/util';

/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {
  const order: Order = await new Promise((resolve) => {
    afetch(`${apiUrl}/order/${params.orderId}`, undefined, fetch)
      .then((res) => res.json())
      .then((data) => resolve(data))
      .catch((_) => resolve(null));
  });

  if (!order) throw error(404, 'Not found');

  sanitizeOrder(order);

  return { order };
}
