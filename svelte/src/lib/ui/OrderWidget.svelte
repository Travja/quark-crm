<script lang="ts">
  import moment from 'moment';
  import type { Order } from '@types/global';
  import { getOrderStatusColor, getTreeStatusColor } from '$lib/api/colors';
  import Pill from '$lib/ui/Pill.svelte';
  import { formatCurrency, formatDate } from '$lib/api/util';
  import { PrintType } from '$lib/models/order';

  export let order: Order;

  const isRequestSoon = (date: Date | string) => {
    if (moment(date).isBefore(moment().subtract(2, 'weeks'))) return false;

    const threeWeeks = moment().add(3, 'weeks');
    return moment(date).isBefore(threeWeeks);
  };
</script>

<!-- TODO History section... what does it hold, and where should it be displayed? -->

<a href="/order/{order.id}" class="widget">
  <div class="header-row">
    <span class="name">{order.customer.customerName}</span>
    <Pill color={getOrderStatusColor(order.status)}>{order.status}</Pill>
    <Pill color={getTreeStatusColor(order.treeStatus)}>{order.treeStatus}</Pill>
    <Pill>{order.generations}gen {order.type}</Pill>
    <Pill>
      <div>
        <span>{order.printType}</span>
        {#if order.printType !== PrintType.DIGITAL}
          <span>- {order.printSize}</span>
        {/if}
      </div>
    </Pill>
    <span class="spacer" />
    <span class="income">{formatCurrency(order.cost)}</span>
    <span class="expense">{formatCurrency(order.expenses)}</span>
    <span class="profit">{formatCurrency(order.cost - order.expenses)}</span>
  </div>
  <div class="secondary-row">
    <span class="dates">
      <span class="order-date">{formatDate(order.created)}</span>
      {#if order.requestDate}
        <span>&rarr;</span>
        <span
          class="request-date"
          class:request-soon={isRequestSoon(order.requestDate)}
          >{formatDate(order.requestDate)}</span
        >
      {/if}
    </span>
    {#if order.lastContact}
      <span class="last-contact">Last Contact: {order.lastContact}</span>
    {/if}
  </div>
  <div class="secondary-row">
    <span class="notes" class:no-notes={!order.notes}
      >{order.notes || 'No notes...'}</span
    >
    <span class="spacer" />
    <span class="artist">{order.artist}</span>
  </div>
</a>

<style>
  .widget {
    display: block;
    text-decoration: none;
    color: unset;

    background-color: var(--title-bg-color);
    padding: 0.5em 0.75em;
    margin: 0.4em 0.5em;
    border-radius: 0.5em;
    border: 1px solid var(--ui-button-hover);
  }

  .header-row,
  .secondary-row {
    display: flex;
    align-items: center;
    gap: 0.3em;

    flex-wrap: wrap;

    margin-bottom: 0.25rem;
  }

  .header-row {
    margin-bottom: 0;
  }

  .name {
    font-weight: bold;
    margin-right: 0.4em;
  }

  .order-date,
  .request-date,
  .last-contact {
    font-size: 0.8rem;
    color: var(--fg-color-light);
  }

  .last-contact {
    border-left: 1px solid var(--fg-color-light);
    padding-left: 0.5em;
  }

  .request-date.request-soon {
    color: red;
    font-weight: bold;
  }

  .notes {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .no-notes {
    color: var(--fg-color-light);
    font-style: italic;
  }

  .spacer {
    flex: 1;
  }

  .income {
    color: #00a115;
    font-weight: bold;
  }

  .income::before {
    content: '+';
  }

  .expense {
    color: #ff0000;
    font-weight: bold;
  }

  .expense::before {
    content: '-';
  }

  .profit {
    color: #5276ff;
    font-weight: bold;
  }
</style>
