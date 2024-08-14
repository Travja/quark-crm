import { type Writable, writable } from 'svelte/store';
import type { Order } from './models/order';
import { afetch } from '$lib/http';

export const orders: Writable<Order[]> = writable<Order[]>([]);

export const loadData = (): void => {
  afetch('http://localhost:8080/order')
    .then((res) => res.json())
    .then((data: Order[]) => {
      if (!data) {
        orders.set([]);
        return;
      }

      data.forEach((datum) => {
        if (datum.created) datum.created = new Date(datum.created);
        if (datum.requestDate) datum.requestDate = new Date(datum.requestDate);
      });
      orders.set(data);
    })
    .catch(() => orders.set([]));
};
