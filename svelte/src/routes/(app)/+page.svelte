<script lang="ts">
  import {
    artists,
    filteredOrders,
    loadData,
    orderStatusFilter,
    searchFilter,
    treeFilters
  } from '$lib/data';
  import StyledInput from '$lib/ui/StyledInput.svelte';
  import {
    getPrintTypeShortCode,
    OrderStatus,
    TreeStatus
  } from '$lib/models/order';
  import Modal from '$lib/Modal.svelte';
  import LabeledInput from '$lib/ui/LabeledInput.svelte';
  import {
    getOrderStatusColor,
    getOrderStatusForegroundColor,
    getTreeStatusColor,
    getTreeStatusForegroundColor
  } from '$lib/api/colors';
  import { afetch } from '$lib/http';
  import type { Order } from '@types/global';
  import OrderWidget from '$lib/ui/OrderWidget.svelte';
  import { onMount } from 'svelte';
  import { formatDate } from '$lib/api/util';

  let filterBoxShown = false;
  let notesOpen = false;
  let notesModal = undefined;

  onMount(() => loadData($searchFilter));

  const checkEnter = (event: KeyboardEvent) => {
    if (event.key == 'Enter') {
      // TODO Apply search/filter
    }
  };

  const updateOrder = (order: Order) => {
    afetch('http://localhost:8080/order', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(order)
    })
      .then(() => loadData($searchFilter))
      .catch((err) => console.error('Error updating order', err));
  };
</script>

<div class="heading-bar">
  <span id="filter-wrapper">
    <span
      role="button"
      tabindex="0"
      class="material-icons icon-button"
      on:click={() => (filterBoxShown = !filterBoxShown)}
      on:keypress={(e) => {
        if (e.key === 'Enter') filterBoxShown = !filterBoxShown;
      }}
    >
      filter_alt
    </span>
    {#if filterBoxShown}
      <div id="filter-box">
        <h2>Filters</h2>
        <div class="filter">
          <div class="filter-section">
            <h3>Order Status</h3>
            {#each Object.values(OrderStatus) as status}
              <div class="filter-order-status">
                <input
                  type="checkbox"
                  id="order-status-{status.toLowerCase().replace(' ', '_')}"
                  checked={$orderStatusFilter.includes(status)}
                  on:change={(e) => {
                    if (
                      e.target.checked &&
                      !$orderStatusFilter.includes(status)
                    ) {
                      orderStatusFilter.update((s) => [...s, status]);
                    } else {
                      orderStatusFilter.update((s) =>
                        s.filter((f) => f !== status)
                      );
                    }
                  }}
                />
                <label
                  for="order-status-{status.toLowerCase().replace(' ', '_')}"
                  >{status}</label
                >
              </div>
            {/each}
          </div>
          <div class="filter-section">
            <h3>Tree Status</h3>
            {#each Object.values(TreeStatus) as status}
              <div class="filter-tree-status">
                <input
                  type="checkbox"
                  id="tree-status-{status.toLowerCase().replace(' ', '_')}"
                  checked={$treeFilters.includes(status)}
                  on:change={(e) => {
                    if (e.target.checked && !$treeFilters.includes(status)) {
                      treeFilters.update((s) => [...s, status]);
                    } else {
                      treeFilters.update((s) => s.filter((f) => f !== status));
                    }
                  }}
                />
                <label
                  for="tree-status-{status.toLowerCase().replace(' ', '_')}"
                  >{status}</label
                >
              </div>
            {/each}
          </div>
        </div>
      </div>
    {/if}
  </span>
  <span
    role="button"
    tabindex="0"
    class="material-icons icon-button"
    on:click={() => loadData($searchFilter)}
    on:keypress={(e) => {
      if (e.key === 'Enter') loadData($searchFilter);
    }}>sync</span
  >
  <span class="spacer" />
  <StyledInput
    placeholder="Search..."
    fontSize="1.2em"
    margin="0"
    on:keypress={checkEnter}
  />
</div>
<div class="center">
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
      {#each $filteredOrders as order (order.id)}
        <tr>
          <!-- Customer Name -->
          <td>
            <a
              href="/order/{order.id}"
              title="{order.customer.customerName}'s order"
            >
              {order.customer.customerName}
            </a>
          </td>
          <!-- Last Contact -->
          <td>{order.lastContact || ''}</td>
          <!-- History -->
          <td></td>
          <!-- Order Status -->
          <td class="no-padding">
            <StyledInput
              type="select"
              class="order-status"
              bind:value={order.status}
              backgroundColor={getOrderStatusColor(order.status)}
              color={getOrderStatusForegroundColor(order.status)}
              on:change={() => updateOrder(order)}
            >
              {#each Object.values(OrderStatus) as status}
                <option value={status} selected={order.status === status}
                  >{status}</option
                >
              {/each}
            </StyledInput>
          </td>
          <!-- Order(created) Date -->
          <td>
            {formatDate(order.created)}
          </td>
          <!-- Due Date -->
          <td
            style:color={order.requestDate ? 'black' : undefined}
            style:background-color={order.requestDate ? '#fdfba1' : undefined}
          >
            {order.requestDate ? formatDate(order.requestDate) : ''}
          </td>
          <!-- Tree Status -->
          <td class="no-padding">
            <StyledInput
              type="select"
              class="tree-status"
              bind:value={order.treeStatus}
              color={getTreeStatusForegroundColor(order.treeStatus)}
              backgroundColor={getTreeStatusColor(order.treeStatus)}
              on:change={() => updateOrder(order)}
            >
              {#each Object.values(TreeStatus) as status}
                <option value={status} selected={order.treeStatus === status}
                  >{status}</option
                >
              {/each}
            </StyledInput>
            <!--{order.treeStatus}-->
          </td>
          <!-- Artist -->
          <td class="no-padding">
            <StyledInput
              type="select"
              bind:value={order.artist}
              on:change={() => updateOrder(order)}
            >
              {#each $artists as artist}
                <option
                  value={artist.firstName}
                  selected={order.artist === artist.firstName}
                  >{artist.firstName}</option
                >
              {/each}
            </StyledInput>
          </td>
          <!-- Notes -->
          <td
            class="notes"
            on:click={() => {
              notesModal = order;
              notesOpen = true;
            }}
            title={order.notes || 'No Notes'}
          >
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
          <td></td>
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

{#each $filteredOrders as order}
  <OrderWidget {order} />
{/each}

<Modal bind:open={notesOpen} width="50vw">
  <h2>Notes</h2>
  <LabeledInput
    readonly
    type="textarea"
    fillSpace="true"
    bind:value={notesModal.notes}
  />
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
    /*width: 100%;*/
  }

  table {
    border-collapse: collapse;
  }

  table td,
  table th {
    border: 1px solid var(--ui-button-hover);
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
    color: var(--link-color);
  }

  .notes {
    max-width: 10rem;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .no-padding {
    padding: 0;
  }

  #filter-box {
    position: absolute;
    z-index: 10;
    background-color: var(--bg-secondary);
    padding: 0.5rem;
    border-radius: 0.5rem;
  }

  #filter-box h2 {
    margin: 0;
  }

  .filter-section {
    display: flex;
    flex-direction: column;
  }

  label {
    user-select: none;
  }
</style>
