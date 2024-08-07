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
      <div class='demo'>
        <container class='data-container'>
          <OrderBox {order} />
        </container>
        <div class='wrapper'>
          <div class='column'>
            <h2>In</h2>
            <LabeledInput type='number'>
              Print Cost
            </LabeledInput>
            <LabeledInput type='number'>
              Shipping Cost
            </LabeledInput>

            <h2>Out</h2>
            <LabeledInput type='number'>
              Print
            </LabeledInput>
            <LabeledInput type='number'>
              Shipping
            </LabeledInput>
            <LabeledInput type='number'>
              Tax
            </LabeledInput>

            <hr />
            <LabeledInput type='number'>
              Total
            </LabeledInput>

            <div class='sp-in'>
              <input placeholder=' ' class='sp-input' type='number' value='100' />
              <label>Test</label>
            </div>
          </div>
        </div>
      </div>
    {/each}
  </container>
{/if}

<style>
    .sp-in {
        position: relative;
        margin: 0.5rem 0;
    }

    .sp-in label {
        position: absolute;
        top: 0.5rem;
        left: 0;
        color: #aaa;
        padding-inline: 0.5rem;
        pointer-events: none;
        transition: all 0.2s ease;
        /*background-color: red;*/
        /*height: 5px;*/

        display: flex;
        align-items: center;
    }

    .sp-in:has(input:not(:placeholder-shown)) label,
    .sp-in:has(input:focus) label  {
        color: white;
        background-color: #222;
        transform: translate(-0.25rem, -1rem) scale(0.8);
    }

    .sp-input {
        border: none;
        background-color: green;
        color: white;
        width: 100%;
        box-sizing: border-box;
        font-size: 1rem;
        padding: 0.5rem;
    }

    .sp-input:focus {
        outline: none;
        border-bottom: 2px solid var(--title-accent-color);
    }

    .demo {
        display: flex;
        flex-direction: row;
    }

    .wrapper {
        display: flex;
        flex-direction: row;
        background-color: #444;
        flex: 0.2;
        margin: 1rem;
        padding: 1.5rem;
        border-radius: 2rem;
        border: 2px solid black;
    }

    .wrapper > * {
        flex: 1;
    }

    .data-container {
        display: flex;
        flex-direction: column;
        padding: 0.5rem;
        margin-top: 0.5rem;
        background-color: rgba(125, 125, 125, 0.5);
        border-radius: 0 0.5rem 0.5rem;
        border: 2px solid rgba(200, 200, 200, 0.5);
        overflow: auto;
        flex: 1;
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