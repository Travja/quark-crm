import {
  derived,
  type Readable,
  readonly,
  type Writable,
  writable
} from 'svelte/store';
import { OrderStatus, TreeStatus } from './models/order';
import { afetch } from '$lib/http';
import type { Order, SearchFilter } from 'global';

export const loadData = (filter: SearchFilter): Promise<Order[]> => {
  return new Promise((resolve, reject) => {
    afetch('http://localhost:8080/order/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(filter)
    })
      .then((res) => res.json())
      .then((data: Order[]) => {
        if (!data) {
          resolve([]);
          return;
        }

        data.forEach((datum) => {
          if (datum.created) datum.created = new Date(datum.created);
          if (datum.requestDate)
            datum.requestDate = new Date(datum.requestDate);
        });
        resolve(data);
      })
      .catch(() => reject([]));
  });
};

const _filteredOrders: Writable<Order[]> = writable<Order[]>([]);
export const filteredOrders: Readable<Order[]> = readonly(_filteredOrders);

export const orderStatusFilter: Writable<OrderStatus[]> = writable<
  OrderStatus[]
>([
  OrderStatus.ORDER_PLACED,
  OrderStatus.UNPAID,
  OrderStatus.INVOICED,
  OrderStatus.PAID,
  OrderStatus.PRINT_ORDERED,
  OrderStatus.QUESTION_ASKED,
  OrderStatus.QUESTION_ANSWERED
]);
export const treeFilters: Writable<TreeStatus[]> = writable<TreeStatus[]>([
  ...Object.values(TreeStatus)
]);

export const searchFilter: Readable<SearchFilter> = derived(
  [orderStatusFilter, treeFilters],
  (values) => {
    const statusFilter: OrderStatus[] = values[0];
    const treeFilter: TreeStatus[] = values[1];

    return <SearchFilter>{
      statusFilter,
      treeFilter
    };
  }
);

searchFilter.subscribe((value) =>
  loadData(value).then((data) => _filteredOrders.set(data))
);
