import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import type { Order } from './models/order';

export const orders: Writable<Order[]> = writable<Order[]>([]);

export const loadData = (): void => {
  fetch('https://api.cfta.travja.dev/order')
    .then(res => res.json())
    .then((data: Order[]) => {
      if (!data) {
        orders.set([]);
        return;
      }

      data.forEach(datum => {
        if (datum.created)
          datum.created = new Date(datum.created);
        if (datum.requestDate)
          datum.requestDate = new Date(datum.requestDate);
      });
      orders.set(data);
    });
};
