<script lang="ts">
  import { onMount } from 'svelte';
  import type { Customer, Order } from '@types/global';
  import OrderPanel               from '$lib/ui/order/OrderPanel.svelte';

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
  {#each orders as order}
    <OrderPanel {order} />
  {/each}
{/if}
