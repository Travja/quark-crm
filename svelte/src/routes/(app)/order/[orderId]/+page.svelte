<script lang="ts">
  import { onMount } from 'svelte';
  import { CustomerType } from '$lib/models/order.js';
  import type { Customer, Order } from '@types/global';
  import OrderPanel from '$lib/ui/OrderPanel.svelte';

  export let data: { orders: Order[] };
  let orders: Order[];
  let customer: Customer;

  const initData = (): void => {
    if (!orders || orders.length == 0) return;

    customer = orders[0].customer;
  };

  onMount(() => {
    // Do something
    orders = data.orders;
    initData();
  });
</script>

{#if !customer}
  No orders
{:else}
  <div class="customer-info">
    <h3>
      <a href="/customer/{customer.id}">{customer.customerName}</a>
      <span
        class="new-customer material-symbols-outlined"
        hidden={customer.customerType != CustomerType.NEW}
      >
        new_releases
      </span>
      <span> - </span>
      <a href="mailto:{customer.customerEmail}">{customer.customerEmail}</a>
    </h3>
  </div>
  {#each orders as order}
    <OrderPanel {order} />
  {/each}
{/if}

<style>
  .new-customer {
    color: #5276ff;
    font-size: 1rem;
  }

  .customer-info {
    border-left: 3px solid var(--title-accent-color);
    padding-left: 0.7rem;
  }
</style>
