import { error } from '@sveltejs/kit';
import { afetch, apiUrl } from '$lib/http';
import type { Customer } from 'global';

/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {
  const customer: Customer = await new Promise((resolve) => {
    afetch(`${apiUrl}/customer/${params.customerId}`, undefined, fetch)
      .then((res) => res.json())
      .then((data) => resolve(data))
      .catch((e) => resolve(null));
  });

  if (!customer) throw error(404, 'Not found');

  return { customer };
}
