<script lang="ts">
  import type { Customer } from '@types/global';
  import OrderWidget from '$lib/ui/OrderWidget.svelte';
  import { onMount } from 'svelte';
  import { CustomerType } from '$lib/models/order';
  import LabeledInput from '$lib/ui/LabeledInput.svelte';
  import Pill from '$lib/ui/Pill.svelte';
  import { isActive, sortOrders } from '$lib/data';

  export let data: { customer: Customer };
  let customer: Customer;
  let knownAddresses: string[];
  let openOrders = 0;

  onMount(() => {
    customer = data.customer;

    customer.orders.forEach((order) => {
      order.created = new Date(order.created);
      order.requestDate = order.requestDate
        ? new Date(order.requestDate)
        : null;
      order.customer = customer;
    });

    // Sort the data, prioritizing the closest, non-future request dates first
    customer.orders.sort(sortOrders);
  });

  $: knownAddresses = customer?.orders
    .map((order) => order.shippingAddress)
    .filter((address) => !!address)
    .filter((value, index, self) => self.indexOf(value) === index);
  $: openOrders = customer?.orders.filter((order) =>
    isActive(order.status)
  ).length;
</script>

{#if customer}
  <h2>
    <span>{customer.customerName}</span>
    <span
      class="new-customer material-symbols-outlined"
      hidden={customer.customerType != CustomerType.NEW}
    >
      new_releases
    </span>
  </h2>

  <div class="body">
    <div class="aside">
      <div class="section">
        <LabeledInput
          bind:value={customer.customerType}
          options={Object.values(CustomerType)}
        >
          Customer Type
        </LabeledInput>
      </div>
      <hr />
      <div class="identities">
        {#if customer.alternateNames?.length > 0}
          <div class="names">
            <div>AKA</div>
            <span class="other-names">
              {#each customer.alternateNames as name}
                <Pill color="rgba(0,0,0,0.3)">{name}</Pill>
              {/each}
            </span>
          </div>
        {/if}

        <div class="email">
          <div>Email</div>
          <Pill color="rgba(0,0,0,0.3)">
            <a href="mailto:{customer.customerEmail}"
              >{customer.customerEmail}</a
            >
          </Pill>
        </div>

        {#if customer.alternateEmails?.length > 0}
          <div class="emails">
            <div>Other Emails</div>
            <span class="other-emails">
              {#each customer.alternateEmails as email}
                <Pill color="rgba(0,0,0,0.3)"
                  ><a href="mailto:{email}">{email}</a></Pill
                >
              {/each}
            </span>
          </div>
        {/if}

        {#if knownAddresses.length > 0}
          <div class="section">
            <div>Known Addresses</div>
            <ul>
              {#each knownAddresses as address}
                <li>{address}</li>
              {/each}
            </ul>
          </div>
        {/if}
      </div>

      <hr />

      <div class="section">
        <LabeledInput
          type="textarea"
          bind:value={customer.notes}
          placeholder="😨 No Notes...">Notes</LabeledInput
        >
      </div>
    </div>
    <div class="orders">
      <h3 class="orders-header">
        <span>Orders</span>
        <Pill color={openOrders > 1 ? 'yellow' : 'green'}
          >{openOrders} Open</Pill
        >
        <Pill color="skyblue">{customer.orders.length} Total</Pill>
      </h3>
      {#each customer.orders as order}
        <OrderWidget {order} />
      {/each}
    </div>
  </div>
{:else}
  Loading...
{/if}

<style>
  .new-customer {
    color: #5276ff;
    font-size: 0.8em;
  }

  .identities {
    display: flex;
    flex-direction: column;
    gap: 1em;
  }

  .other-names,
  .other-emails {
    display: flex;
    flex-wrap: wrap;
  }

  .body {
    display: grid;
    grid-template-areas: 'body aside';
    grid-template-columns: auto 20%;
    gap: 0.75rem;
  }

  .orders {
    grid-area: body;
  }

  .orders-header {
    display: flex;
    align-items: center;
    gap: 0.5em;
  }

  .aside {
    grid-area: aside;
  }
</style>
