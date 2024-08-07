<script lang='ts'>
  import { orders } from '$lib/data';
  import StyledInput from '$lib/ui/StyledInput.svelte';
  import { loadData } from '$lib/data.js';
  import { onMount } from 'svelte';
  import Toggle from '$lib/ui/Toggle.svelte';
  import { OrderStatus } from '$lib/models/order';
  import { getPrintTypeShortCode } from '$lib/models/order.js';
  import Modal from '$lib/Modal.svelte';
  import LabeledInput from '$lib/ui/LabeledInput.svelte';
  import {
    getOrderStatusColor,
    getOrderStatusForegroundColor,
    getTreeStatusColor,
    getTreeStatusForegroundColor
  } from '$lib/api/colors';

  let allOrders = true;
  let notesOpen = false;
  let notesModal = undefined;

  onMount(loadData);

  const checkEnter = (event: KeyboardEvent) => {
    if (event.key == 'Enter') {
      // TODO Apply search/filter

    }
  };

  const orderIsActive = (orderStatus: OrderStatus) => {
    let orderIndex = Object.values(OrderStatus).indexOf(orderStatus);
    let trackingSentIndex = Object.values(OrderStatus).indexOf(OrderStatus.TRACKING_SENT);
    return orderIndex < trackingSentIndex;
  };

</script>

<div class='heading-bar'>
  <div class='material-icons icon-button'>filter_alt</div>
  <div class='material-icons icon-button' on:click={loadData}>sync</div>
  <Toggle right='Active' left='All' color='var(--ui-button-hover)' bind:value={allOrders} />
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
      <th>Tree Status</th>
      <th>Artist</th>
      <th>Notes</th>
      <th>Tree Type</th>
      <th>Generations</th>
      <th>Print</th>
      <th>Size</th>
      <th>$ In</th>
      <th>Vendor</th>
      <th>$ Out</th>
      <th>Profit</th>
    </tr>
    </thead>
    <tbody>
    {#each $orders as order}
      {#if allOrders || orderIsActive(order.status)}
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
          <td
            style:background-color={getOrderStatusColor(order.status)}
            style:color={getOrderStatusForegroundColor(order.status)}
          >{order.status}</td>
          <!-- Order(created) Date -->
          <td>
            {
              new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' })
                .format(order.created)
            }
          </td>
          <!-- Due Date -->
          <td
            style:color={order.requestDate ? 'black' : undefined}
            style:background-color={order.requestDate ? '#fdfba1' : undefined}
          >
            {
              order.requestDate ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' })
                .format(order.requestDate) : ''
            }
          </td>
          <!-- Tree Status -->
          <td
            style:color={getTreeStatusForegroundColor(order.treeStatus)}
            style:background-color={getTreeStatusColor(order.treeStatus)}
          >{order.treeStatus}</td>
          <!-- Artist -->
          <td>
            Karen
          </td>
          <!-- Notes -->
          <td class='notes' on:click={() => {
            notesModal = order;
            notesOpen = true;
          }}>
            {order.notes || ''}
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
            {getPrintTypeShortCode(order.printType)}
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
      {/if}
    {/each}
    </tbody>
  </table>
</div>

<Modal bind:open={notesOpen} width='50vw'>
  <h2>Notes</h2>
  <LabeledInput type='textarea' fillSpace='true' bind:value={notesModal.notes} />
</Modal>

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

    .notes {
        max-width: 10rem;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>