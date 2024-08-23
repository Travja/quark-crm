import {
  derived,
  readable,
  type Readable,
  type Writable,
  writable
} from 'svelte/store';
import { OrderStatus, TreeStatus } from './models/order';
import { afetch } from '$lib/http';
import type { Artist, Order, SearchFilter } from 'global';

export const artists: Readable<Artist[]> = readable([], (set) => {
  afetch('http://localhost:8080/api/artists')
    .then((res) => res.json())
    .then((data) => set(data))
    .catch(() => set([]));
});

export const loadData = (filter: SearchFilter): Promise<Order[]> => {
  return new Promise((resolve) => {
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
          filteredOrders.set([]);
          resolve([]);
          return;
        }

        data.forEach((datum) => {
          if (datum.created) datum.created = new Date(datum.created);
          if (datum.requestDate)
            datum.requestDate = new Date(datum.requestDate);
        });

        // Sort the data, prioritizing the closest, non-future request dates first
        const now = new Date().getTime();
        data.sort((a, b) => {
          const aTime = a.requestDate ? (<Date>a.requestDate).getTime() : 0;
          const bTime = b.requestDate ? (<Date>b.requestDate).getTime() : 0;

          const aIsFuture = aTime > now;
          const bIsFuture = bTime > now;

          if (aIsFuture && !bIsFuture) {
            return -1;
          } else if (!aIsFuture && bIsFuture) {
            return 1;
          } else if (aIsFuture && bIsFuture && a.requestDate && b.requestDate) {
            return aTime - now - (bTime - now);
          } else if (
            !aIsFuture &&
            !bIsFuture &&
            a.requestDate &&
            b.requestDate
          ) {
            return bTime - now - (aTime - now);
          } else if (a.requestDate) {
            return -1;
          } else if (b.requestDate) {
            return 1;
          } else {
            return 0;
          }
        });

        filteredOrders.set(data);
        resolve(data);
      })
      .catch(() => {
        filteredOrders.set([]);
        resolve([]);
      });
  });
};

export const filteredOrders: Writable<Order[]> = writable<Order[]>([]);

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
export const searchTerms = writable<string>('');

export const searchFilter: Readable<SearchFilter> = derived(
  [orderStatusFilter, treeFilters, searchTerms],
  (values) => {
    const statusFilter: OrderStatus[] = values[0];
    const treeFilter: TreeStatus[] = values[1];

    return <SearchFilter>{
      statusFilter,
      treeFilter,
      keywords: values[2]
    };
  }
);

let timeout: number | undefined;
searchFilter.subscribe((filter) => {
  console.log(filter);
  if (timeout) clearTimeout(timeout);
  timeout = window.setTimeout(() => loadData(filter), 500);
});
