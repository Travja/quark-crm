import { get, type Writable, writable } from 'svelte/store';
import type { Order } from './models/order';

export const _token: Writable<string> = writable<string>('');

export const orders: Writable<Order[]> = writable<Order[]>([]);

export const loadData = (): void => {
  fetch('http://localhost:8080/order', {
    headers: {
      'Authorization': 'Bearer ' + get(_token)
    }
  })
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
