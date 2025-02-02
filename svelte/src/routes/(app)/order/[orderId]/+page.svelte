<script lang="ts">
  import { onMount } from 'svelte';
  import type { Customer, Order } from '@types/global';
  import OrderPanel from '$lib/ui/order/OrderPanel.svelte';

  interface Props {
    data: { order: Order };
  }

  let { data }: Props = $props();
  let order: Order = $state();
  let customer: Customer = $state();

  const initData = (): void => {
    if (!order) return;

    customer = order.customer;
  };

  onMount(() => {
    // Do something
    order = data.order;
    initData();
  });
</script>

{#if !customer}
  No orders
{:else}
  <OrderPanel {order} />
{/if}
