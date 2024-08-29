<script lang="ts">
  import LabeledInput from '$lib/ui/LabeledInput.svelte';
  import {
    AncestryType,
    BranchStyle,
    CustomerType,
    FontColor,
    OrderStatus,
    PrintSize,
    PrintType,
    RootType,
    TextLocation,
    TreeStatus,
    TreeStyle,
    TreeType
  } from '$lib/models/order';
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import {
    getOrderStatusColor,
    getOrderStatusForegroundColor,
    getTreeStatusColor,
    getTreeStatusForegroundColor
  } from '$lib/api/colors';
  import { afetch } from '$lib/http';
  import { artists } from '$lib/data';
  import type { AdditionalPrint, Customer, Order } from '@types/global';
  import OrderFinancials from '$lib/ui/order/OrderFinancials.svelte';
  import AdditionalPrintWidget from '$lib/ui/order/AdditionalPrintWidget.svelte';
  import Pill from '$lib/ui/Pill.svelte';
  import InsetInput from '$lib/ui/InsetInput.svelte';

  export let order: Order;
  let customer: Customer;

  let dirty = false;
  let originalOrder;
  let newPrint: AdditionalPrint = undefined;

  onMount(() => {
    if (!originalOrder) originalOrder = { ...order };
    customer = order.customer;
  });

  $: if (originalOrder && order)
    dirty = JSON.stringify(order) != JSON.stringify(originalOrder);
  // $: if (dirty) {
  // console.log('og', JSON.stringify(originalOrder));
  // console.log('dirty', JSON.stringify(order));
  // }

  const saveOrder = (): void => {
    afetch('http://localhost:8080/order', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(order)
    })
      .then((res: any) => <Order>res.json())
      .then((ord: Order) => {
        order = ord;
        order.requestDate = order.requestDate + '.000';
        originalOrder = { ...order };
        dirty = false;
      })
      .catch((err) => console.error('Error updating order', err));
  };
</script>

<div class="wrapper">
  <div class="body">
    {#if customer}
      <div class="customer-info full-width">
        <h3>
          <a href="/customer/{customer.id}">{customer.customerName}</a>
          <span
            class="new-customer material-symbols-outlined"
            hidden={customer.customerType !== CustomerType.NEW}
          >
            new_releases
          </span>
          <span> - </span>
          <a href="mailto:{customer.customerEmail}">{customer.customerEmail}</a>
        </h3>
      </div>
    {/if}
    <div class="column">
      Order ID: {order.id}
      <LabeledInput bind:value={order.shipTo} id="ship-to"
        >Ship To
      </LabeledInput>
      <LabeledInput bind:value={order.shippingAddress} id="shipping-address">
        Shipping Address
      </LabeledInput>
      <LabeledInput
        backgroundColor={getOrderStatusColor(order.status)}
        bind:value={order.status}
        color={getOrderStatusForegroundColor(order.status)}
        id="order-status"
        options={Object.values(OrderStatus)}
      >
        Order Status
      </LabeledInput>
      <LabeledInput
        backgroundColor={getTreeStatusColor(order.treeStatus)}
        bind:value={order.treeStatus}
        color={getTreeStatusForegroundColor(order.treeStatus)}
        id="tree-status"
        options={Object.values(TreeStatus)}
      >
        Tree Status
      </LabeledInput>
      <LabeledInput bind:value={order.created} id="order-date" type="datetime">
        Order Date
      </LabeledInput>

      <LabeledInput
        backgroundColor={order.requestDate ? '#fdfba1' : undefined}
        bind:value={order.requestDate}
        color={order.requestDate ? 'black' : undefined}
        id="request-date"
        type="date"
      >
        Due Date
      </LabeledInput>

      <LabeledInput
        bind:value={order.artist}
        id="artist"
        options={['', ...$artists.map((a) => a.firstName)]}
        type="select"
      >
        Artist
      </LabeledInput>

      <LabeledInput
        fillSpace={true}
        id="history"
        placeholder="No history 😨"
        type="textarea"
      >
        History
      </LabeledInput>
    </div>

    <div class="column">
      <LabeledInput
        bind:value={order.type}
        id="tree-type"
        options={Object.values(TreeType)}
      >
        Tree Type
      </LabeledInput>

      {#if order.type === TreeType.ANCESTRY || order.type === TreeType.ANCESTRY_ROOTS}
        <LabeledInput
          id="ancestryType"
          bind:value={order.ancestryType}
          options={Object.values(AncestryType)}
        />
      {/if}

      <LabeledInput
        bind:value={order.generations}
        id="generations"
        type="number"
      >
        Generations
      </LabeledInput>

      {#if order.type === TreeType.ANCESTRY_ROOTS || order.type === TreeType.DESCENDANT_ROOTS}
        <LabeledInput
          id="roots"
          bind:value={order.roots}
          options={Object.values(RootType)}
        >
          Roots
        </LabeledInput>
      {/if}

      <div class="section">
        <label class="head" for="branch-style">Branch Style</label>
        <LabeledInput
          bind:group={order.branchStyle}
          fillSpace={true}
          id="branch-style"
          type="radio"
          value={BranchStyle.STYLE_1}
        >
          <svelte:fragment slot="value">1</svelte:fragment>
        </LabeledInput>

        <LabeledInput
          bind:group={order.branchStyle}
          fillSpace={true}
          id="style-2"
          type="radio"
          value={BranchStyle.STYLE_2}
        >
          <svelte:fragment slot="value">2</svelte:fragment>
        </LabeledInput>
      </div>

      <div class="section">
        <label class="head" for="tree-style">Tree Style</label>
        <LabeledInput
          bind:group={order.treeStyle}
          fillSpace={true}
          id="classic-style"
          type="radio"
          value={TreeStyle.CLASSIC}
        >
          <svelte:fragment slot="value">Classic</svelte:fragment>
        </LabeledInput>

        <LabeledInput
          bind:group={order.treeStyle}
          fillSpace={true}
          id="chalk-style"
          type="radio"
          value={TreeStyle.CHALK}
        >
          <svelte:fragment slot="value">Chalk</svelte:fragment>
        </LabeledInput>
      </div>

      <LabeledInput bind:value={order.background} id="background">
        Background
      </LabeledInput>

      {#if order.treeStyle === TreeStyle.CLASSIC}
        <LabeledInput
          id="fontColor"
          bind:value={order.fontColor}
          options={Object.values(FontColor)}
        >
          Font Color
        </LabeledInput>
      {/if}
    </div>

    <div class="column">
      <LabeledInput bind:value={order.familyName} id="familyName">
        Family Name
      </LabeledInput>

      {#if order.familyName}
        <div class="section" transition:slide|local>
          <LabeledInput
            type="radio"
            id="name-left"
            bind:group={order.nameLocation}
            fillSpace={true}
            value={TextLocation.LEFT}
          >
            <svelte:fragment slot="value">Left</svelte:fragment>
          </LabeledInput>

          {#if !order.groundText}
            <LabeledInput
              type="radio"
              id="quote-center"
              bind:group={order.nameLocation}
              fillSpace={true}
              noTransition
              value={TextLocation.CENTER}
            >
              <svelte:fragment slot="value">Center</svelte:fragment>
            </LabeledInput>
          {/if}

          <LabeledInput
            type="radio"
            id="name-right"
            bind:group={order.nameLocation}
            fillSpace={true}
            value={TextLocation.RIGHT}
          >
            <svelte:fragment slot="value">Right</svelte:fragment>
          </LabeledInput>
        </div>

        <!--{#if order.established}-->
        <LabeledInput id="established" bind:value={order.established}>
          Established
        </LabeledInput>
        <!--{/if}-->

        <LabeledInput id="familyFont" bind:value={order.familyFont}>
          Family Font
        </LabeledInput>
      {/if}

      <div class="group">
        <LabeledInput bind:value={order.hasLeaves} id="leaves" type="checkbox">
          Leaves
        </LabeledInput>

        <LabeledInput
          bind:value={order.hasDateBranches}
          id="date-branches"
          type="checkbox"
        >
          Date Branches
        </LabeledInput>
      </div>

      {#if order.hasDateBranches}
        <LabeledInput id="num-date-branches" bind:value={order.branchesAmount}>
          Number of Branches
        </LabeledInput>
      {/if}

      <LabeledInput
        bind:value={order.comments}
        fillSpace={true}
        id="comments"
        type="textarea"
      >
        Comments
      </LabeledInput>
    </div>

    <div class="column">
      <LabeledInput
        bind:value={order.notes}
        fillSpace={true}
        id="notes"
        placeholder="Notes..."
        type="textarea"
      >
        Order Notes
      </LabeledInput>

      <LabeledInput bind:value={order.groundText} id="groundText">
        Ground Text
      </LabeledInput>

      {#if order.groundText}
        <LabeledInput id="groundFont" bind:value={order.groundFont}>
          Ground Font
        </LabeledInput>
      {/if}

      <LabeledInput bind:value={order.quote} id="quote">Quote</LabeledInput>

      {#if order.quote}
        <div class="section" transition:slide|local>
          <LabeledInput
            type="radio"
            id="quote-left"
            bind:group={order.quoteLocation}
            fillSpace={true}
            noTransition
            value={TextLocation.LEFT}
          >
            <svelte:fragment slot="value">Left</svelte:fragment>
          </LabeledInput>

          <LabeledInput
            type="radio"
            id="quote-right"
            bind:group={order.quoteLocation}
            fillSpace={true}
            noTransition
            value={TextLocation.RIGHT}
          >
            <svelte:fragment slot="value">Right</svelte:fragment>
          </LabeledInput>
        </div>

        <LabeledInput id="quoteFont" bind:value={order.quoteFont}>
          Quote Font
        </LabeledInput>
      {/if}

      <LabeledInput
        bind:value={order.printType}
        id="print-type"
        options={Object.values(PrintType)}
      >
        Print Type
      </LabeledInput>

      {#if order.printType !== PrintType.DIGITAL}
        <LabeledInput
          id="print-size"
          bind:value={order.printSize}
          options={Object.values(PrintSize)}
        >
          Print Size
        </LabeledInput>
        <LabeledInput bind:value={order.frame} id="frame">Frame</LabeledInput>
      {/if}
      {#if order.printSize}
        <div>
          <h3>Additional Prints</h3>
          {#each order.additionalPrints as print}
            <AdditionalPrintWidget
              bind:print
              on:delete={() => {
                order.additionalPrints = order.additionalPrints.filter(
                  (p) => p !== print
                );
              }}
            />
          {/each}
          <div>
            {#if !newPrint}
              <Pill
                hover
                on:click={() =>
                  (newPrint = {
                    quantity: 1,
                    printType: PrintType.STANDARD,
                    printSize: PrintSize.EIGHT_BY_TEN,
                    frame: '',
                    cost: 0,
                    frameCost: 0
                  })}
              >
                <span class="material-symbols-outlined">add</span>
              </Pill>
            {:else}
              <InsetInput
                bind:value={newPrint.quantity}
                id="new-print-quantity"
                type="number"
                min=1
              >
                Quantity
              </InsetInput>
              <InsetInput
                bind:value={newPrint.printType}
                id="new-print-type"
                type="dropdown"
                on:change={() => {
                  if (newPrint.printType === PrintType.DIGITAL) {
                    newPrint.printSize = undefined;
                  }
                  if (
                    newPrint.printType === PrintType.CANVAS ||
                    newPrint.printType === PrintType.DIGITAL
                  ) {
                    newPrint.frame = undefined;
                    newPrint.frameCost = 0;
                  }
                }}
              >
                <svelte:fragment slot="dropdown">
                  {#each Object.values(PrintType) as type}
                    <option value={type}>{type}</option>
                  {/each}
                </svelte:fragment>
                <span slot="default">Print Type</span>
              </InsetInput>
              {#if newPrint.printType !== PrintType.DIGITAL}
                <InsetInput
                  bind:value={newPrint.printSize}
                  id="new-print-size"
                  type="dropdown"
                >
                  <svelte:fragment slot="dropdown">
                    {#each Object.values(PrintSize) as size}
                      <option value={size}>{size}</option>
                    {/each}
                  </svelte:fragment>
                  <span slot="default">Print Size</span>
                </InsetInput>
                {#if newPrint.printType !== PrintType.CANVAS}
                  <InsetInput
                    bind:value={newPrint.frame}
                    id="new-print-frame"
                    type="text"
                  >
                    Frame
                  </InsetInput>
                {/if}
              {/if}
              <InsetInput
                bind:value={newPrint.cost}
                id="new-print-cost"
                type="number"
                min=0
              >
                Print Cost
              </InsetInput>
              {#if newPrint.frame}
                <InsetInput
                  bind:value={newPrint.frameCost}
                  id="new-print-frame-cost"
                  type="number"
                  min=0
                >
                  Frame Cost
                </InsetInput>
              {/if}
              <Pill
                color="#5276ff"
                hover
                on:click={() => {
                  order.additionalPrints = [
                    ...order.additionalPrints,
                    newPrint
                  ];
                  newPrint = undefined;
                }}
              >
                <span class="material-symbols-outlined">save</span>
              </Pill>
              <Pill color="red" hover on:click={() => (newPrint = undefined)}>
                <span class="material-symbols-outlined">close</span>
              </Pill>
            {/if}
          </div>
        </div>
      {/if}
    </div>
  </div>

  <div class="aside">
    <div class="aside-content">
      <OrderFinancials bind:order />
    </div>
  </div>
</div>
{#if dirty}
  <footer>
    <div>
      There are unsaved changes on this order. Please save now to avoid losing
      changes.
    </div>
    <button class="save-button" on:click={() => saveOrder()}>
      Save Order
    </button>
  </footer>
{/if}

<style>
  .new-customer {
    color: #5276ff;
    font-size: 1rem;
  }

  .customer-info {
    border-left: 3px solid var(--title-accent-color);
    padding-left: 0.7rem;
  }

  .full-width {
    flex-basis: 100%;
  }

  .wrapper {
    flex: 1;
    display: grid;
    grid-template-areas: 'body aside';
    grid-template-columns: auto 13rem;
  }

  .body {
    height: max-content;
    width: 100%;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
  }

  .aside {
    height: 100%;
    margin-left: 0.5rem;
    padding-left: 0.5rem;
    border-left: 2px groove rgba(0, 0, 0, 0.4);
  }

  .group {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  .column {
    display: flex;
    flex-direction: column;
    flex: 1;
    margin: 0.25rem;
  }

  .section {
    display: flex;
    flex-wrap: wrap;
  }

  .section .head {
    display: block;
    flex-basis: 100%;
    font-size: 0.9rem;
    margin: 0.5rem 0 0.25rem;
    overflow: hidden;
  }

  footer {
    text-align: right;
  }

  .save-button {
    background-color: var(--warning-color);
    color: white;
    padding: 0.5rem;
    border-radius: 0.5rem;
    border: 2px solid var(--fg-color);
    margin: 0.5rem 0.5rem 0;
    white-space: nowrap;
  }

  .save-button:hover {
    cursor: pointer;
    box-shadow: 0.2rem 0.2rem 0.3rem #333;
  }

  .save-button:active {
    cursor: pointer;
    box-shadow: inset -0.2rem -0.2rem 0.3rem #333;
  }

  footer {
    margin-top: 0.5rem;
    position: sticky;
    bottom: 0;
    right: 0;
    left: 0;
    border-radius: 1rem;
    padding: 0.5rem 1rem;
    background: var(--bg-secondary);

    display: grid;
    place-items: center;
  }
</style>
