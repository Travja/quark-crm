import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import type { Order } from './models/order';
import { OrderStatus } from './models/order';

export const data: Writable<Order[]> = writable<Order[]>([
  {
    customerName: 'Test',
    orderDate: new Date(),
    status: OrderStatus.ORDER_PLACED
  },
  {
    customerName: 'Test 2',
    orderDate: new Date(),
    status: OrderStatus.COMPLETE
  }
]);
