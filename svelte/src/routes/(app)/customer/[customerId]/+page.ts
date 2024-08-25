import { error } from '@sveltejs/kit';
import { afetch } from '$lib/http';
import type { Customer } from 'global';

/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {
  const customer: Customer = await new Promise((resolve) => {
    afetch(`http://localhost:8080/customer/${params.customerId}`)
      .then((res) => res.json())
      .then((data) => resolve(data))
      .catch((e) => resolve(null));
  });

  if (!customer) throw error(404, 'Not found');

  return { customer };
}
