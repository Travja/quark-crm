<script lang='ts'>
  import { orders } from '$lib/data';
  import StyledInput from '$lib/ui/StyledInput.svelte';
  import { loadData } from '$lib/data.js';
  import { onMount } from 'svelte';

  onMount(loadData);

  const checkEnter = (event: KeyboardEvent) => {
    if (event.key == 'Enter') {
      // TODO Apply search/filter

    }
  };

</script>

<div class='heading-bar'>
  <div class='material-icons icon-button'>filter_alt</div>
  <div class='material-icons icon-button' on:click={loadData}>sync</div>
  <div class='spacer' />
  <StyledInput placeholder='Search...' fontSize='1.2em' margin='0' on:keypress={checkEnter} />
</div>
<div class='center'>
  <table>
    <thead>
    <tr>
      <th>Customer</th>
      <th>Last Contact</th>
      <th>History</th>
      <th>Order Status</th>
      <th>Order Date</th>
      <th>Due Date</th>
      <th>Artist</th>
      <th>Notes</th>
      <th>Tree Type</th>
      <th>Generations</th>
      <th>Print Type</th>
      <th>Size</th>
      <th>$ In</th>
      <th>Vendor</th>
      <th>$ Out</th>
      <th>Profit</th>
    </tr>
    </thead>
    <tbody>
    {#each $orders as order}
      <tr>
        <!-- Customer Name -->
        <a href='/order/{order.id}'>
          {order.customer.customerName}
        </a>
        <!-- Last Contact -->
        <td>{order.lastContact || ''}</td>
        <!-- History -->
        <td></td>
        <!-- Order Status -->
        <td>{order.status}</td>
        <!-- Order(created) Date -->
        <td>
          {
            new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' })
              .format(order.created)
          }
        </td>
        <!-- Due Date -->
        <td>
          {
            new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' })
              .format(order.requestDate)
          }
        </td>
        <!-- Artist -->
        <td>
          Karen
        </td>
        <!-- Notes -->
        <td>

        </td>
        <!-- Tree Type -->
        <td>
          {order.type}
        </td>
        <!-- Generations -->
        <td>
          {order.generations}
        </td>
        <!-- Print Type -->
        <td>
          {order.printType}
        </td>
        <!-- Print Size -->
        <td>
          {order.printSize || 'N/A'}
        </td>
        <!-- Money In -->
        <td>
          ${order.cost}
        </td>
        <!-- Vendor -->
        <td>

        </td>
        <!-- Money Out -->
        <td>
          ${order.expenses}
        </td>
        <!-- Profit -->
        <td>
          ${order.cost - order.expenses}
        </td>
      </tr>
    {/each}
    </tbody>
  </table>
</div>

<style>
  .heading-bar {
    display: flex;
    align-items: center;
    margin-bottom: 0.5em;
    position: sticky;
    top: 0;
    left: 0;
  }

  .center {
    align-items: stretch;
    width: 100%;
  }

  table {
    border-collapse: collapse;
  }

  table * {
    border: 1px solid var(--fg-color);
    padding: 0.5em;
  }

  thead tr {
    background-color: var(--accent-color);
    color: black;
    font-weight: bold;
  }

  td {
    min-width: 4em;
    white-space: nowrap;
  }

  a {
    display: table-cell;
    color: var(--link-color);
  }

</style>