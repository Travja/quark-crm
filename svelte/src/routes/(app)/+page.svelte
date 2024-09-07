<script lang="ts">
  import {
    activeStatuses,
    filteredOrders,
    inactiveStatuses,
    loadData,
    orderStatusFilter,
    searchFilter,
    searchTerms,
    treeFilters
  } from '$lib/data';
  import StyledInput from '$lib/ui/StyledInput.svelte';
  import { OrderStatus, TreeStatus } from '$lib/models/order';
  import Modal from '$lib/Modal.svelte';
  import LabeledInput from '$lib/ui/LabeledInput.svelte';
  import { afetch, apiUrl } from '$lib/http';
  import type { Order } from '@types/global';
  import OrderWidget from '$lib/ui/order/OrderWidget.svelte';
  import { onMount } from 'svelte';
  import { clickOutside } from '$lib/api/clickoutside';
  import Checkbox from '$lib/ui/Checkbox.svelte';
  import { fly } from 'svelte/transition';

  let filterBoxShown = false;
  let notesOpen = false;
  let notesModal = undefined;

  onMount(() => loadData($searchFilter));

  let debounceActive = false;
  const toggleFilter = () => {
    if (debounceActive) return;
    debounceActive = true;
    filterBoxShown = !filterBoxShown;
    setTimeout(() => (debounceActive = false), 50);
  };

  const checkEnter = (event: KeyboardEvent) => {
    if (event.key == 'Enter') {
      // TODO Apply search/filter
    }
  };

  let activeStatusesSelected = false;
  let someActiveStatusesSelected = false;
  let inactiveStatusesSelected = false;
  let someInactiveStatusesSelected = false;

  let allTreeStatusesSelected = false;
  let someTreeStatusesSelected = false;

  $: activeStatusesSelected = activeStatuses.every((status) =>
    $orderStatusFilter.includes(status)
  );
  $: someActiveStatusesSelected =
    !activeStatusesSelected &&
    activeStatuses.some((status) => $orderStatusFilter.includes(status));
  $: inactiveStatusesSelected = inactiveStatuses.every((status) =>
    $orderStatusFilter.includes(status)
  );
  $: someInactiveStatusesSelected =
    !inactiveStatusesSelected &&
    inactiveStatuses.some((status) => $orderStatusFilter.includes(status));

  $: allTreeStatusesSelected =
    $treeFilters.length === Object.values(TreeStatus).length;
  $: someTreeStatusesSelected =
    $treeFilters.length > 0 &&
    $treeFilters.length !== Object.values(TreeStatus).length;

  const clickAllOrderStatus = () => {
    if ($orderStatusFilter.length === Object.values(OrderStatus).length) {
      orderStatusFilter.set([]);
    } else {
      orderStatusFilter.set(<OrderStatus[]>Object.values(OrderStatus));
    }
  };

  const clickAllTreeStatus = () => {
    if ($treeFilters.length === Object.values(TreeStatus).length) {
      treeFilters.set([]);
    } else {
      treeFilters.set(<TreeStatus[]>Object.values(TreeStatus));
    }
  };
</script>

<div class="heading-bar">
  <span id="filter-wrapper">
    <span
      class="material-symbols-outlined icon-button"
      on:click={toggleFilter}
      on:keypress={(e) => {
        if (e.key === 'Enter') toggleFilter();
      }}
      role="button"
      tabindex="0"
    >
      filter_alt
    </span>
    {#if filterBoxShown}
      <div
        id="filter-box"
        transition:fly={{ y: 50, duration: 400 }}
        use:clickOutside
        on:outclick={toggleFilter}
      >
        <h2>Filters</h2>
        <div class="filter">
          <h3>
            <Checkbox
              id="all"
              checked={$orderStatusFilter.length ===
                Object.values(OrderStatus).length}
              indeterminate={$orderStatusFilter.length > 0 &&
                $orderStatusFilter.length !== Object.values(OrderStatus).length}
              on:change={clickAllOrderStatus}
            />
            <label for="all">Order Status</label>
          </h3>
          <div class="filter-group">
            <div class="filter-section">
              <div class="order-status">
                <!-- Active statuses are Order Placed, Unpaid, Invoiced, Paid, PrintOrdered, Question Asked, Question Answered -->
                <Checkbox
                  id="active"
                  checked={activeStatusesSelected}
                  indeterminate={someActiveStatusesSelected}
                  on:change={() => {
                    if (activeStatusesSelected) {
                      orderStatusFilter.update((current) =>
                        current.filter(
                          (status) => !activeStatuses.includes(status)
                        )
                      );
                    } else {
                      orderStatusFilter.update((current) => [
                        ...current,
                        ...activeStatuses.filter(
                          (status) => !current.includes(status)
                        )
                      ]);
                    }
                  }}
                />
                <label for="active">Active</label>
              </div>
              {#each activeStatuses as status}
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
              <div class="order-status">
                <Checkbox
                  id="inactive"
                  checked={inactiveStatusesSelected}
                  indeterminate={someInactiveStatusesSelected}
                  on:change={() => {
                    if (inactiveStatusesSelected) {
                      orderStatusFilter.update((current) =>
                        current.filter(
                          (status) => !inactiveStatuses.includes(status)
                        )
                      );
                    } else {
                      orderStatusFilter.update((current) => [
                        ...current,
                        ...inactiveStatuses.filter(
                          (status) => !current.includes(status)
                        )
                      ]);
                    }
                  }}
                />
                <label for="inactive">Inactive</label>
              </div>
              {#each inactiveStatuses as status}
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
          </div>
        </div>
        <div class="filter">
          <h3>
            <Checkbox
              id="tree-all"
              checked={$treeFilters.length === Object.values(TreeStatus).length}
              indeterminate={$treeFilters.length > 0 &&
                $treeFilters.length !== Object.values(TreeStatus).length}
              on:change={clickAllTreeStatus}
            />
            <label for="tree-all">Tree Status</label>
          </h3>
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
              <label for="tree-status-{status.toLowerCase().replace(' ', '_')}"
                >{status}</label
              >
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </span>
  <span
    class="material-symbols-outlined icon-button"
    on:click={() => loadData($searchFilter)}
    on:keypress={(e) => {
      if (e.key === 'Enter') loadData($searchFilter);
    }}
    role="button"
    tabindex="0">sync</span
  >
  <span class="spacer" />
  <StyledInput
    bind:value={$searchTerms}
    fontSize="1.2em"
    margin="0"
    on:keypress={checkEnter}
    placeholder="Search..."
  />
</div>

{#if $filteredOrders.length === 0}
  <p class="no-orders">No orders found</p>
{:else}
  {#each $filteredOrders as order}
    <OrderWidget {order} />
  {/each}
{/if}

<Modal bind:open={notesOpen} width="50vw">
  <h2>Notes</h2>
  <LabeledInput
    bind:value={notesModal.notes}
    fillSpace="true"
    readonly
    type="textarea"
  />
</Modal>

<style>
  .heading-bar {
    display: flex;
    align-items: center;
    margin-bottom: 0.5em;
    /*position: sticky;*/
    top: 0;
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

  .filter-group {
    display: flex;
    flex-direction: row;
    gap: 1rem;
  }

  .filter-order-status,
  .filter-tree-status {
    margin-left: 0.5rem;
  }

  label {
    user-select: none;
  }

  .no-orders {
    color: var(--fg-color-light);
    font-style: italic;
  }
</style>
