<script lang='ts'>
  import { onMount } from 'svelte';
  import type { Customer, Order } from '$lib/models/order';
  import OrderBox from '$lib/ui/OrderBox.svelte';
  import LabeledInput from '$lib/ui/LabeledInput.svelte';
  import { CustomerType } from '$lib/models/order.js';

  export let data: { orders: Order[] };
  let orders: Order[];
  let customer: Customer;

  const initData = (): void => {
    if (!orders || orders.length == 0) return;

    customer = orders[0].customer;
  };

  onMount(() => {
    // Do something
    console.log(data);
    orders = data.orders;
    initData();
  });
</script>

{#if !customer}
  No orders
{:else}
  <container>
    <div class='customer-info'>
      <h3>
        {customer.customerName} - <a href='mailto:{customer.customerEmail}'>{customer.customerEmail}</a>
      </h3>
      <div class='column'>
        <LabeledInput bind:value={customer.customerAddress}>
          Address
        </LabeledInput>
      </div>
      <div class='column'>
        <LabeledInput bind:value={customer.customerType}
          options={Object.values(CustomerType)}>
          Customer Type
        </LabeledInput>
      </div>
    </div>
    {#each orders as order}
      <container class='data-container'>
        <OrderBox {order} />
      </container>
    {/each}
  </container>
{/if}

<style>
  .data-container {
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
    margin-top: 0.5rem;
    background-color: rgba(125, 125, 125, 0.5);
    border-radius: 0 0.5rem 0.5rem;
    border: 2px solid rgba(200, 200, 200, 0.5);
    overflow: auto;
  }

  .customer-info {
    border-left: 3px solid var(--title-accent-color);
    padding-left: 0.7rem;
  }

  .column {
    flex: 1;
  }

  h3 a {
    color: var(--title-accent-color);
    text-decoration: none;
  }
</style>