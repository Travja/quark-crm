<!--suppress XmlInvalidId -->
<script lang="ts">
  import LabeledInput from '$lib/ui/LabeledInput.svelte';
  import {
    AncestryType,
    BranchStyle,
    FontColor,
    OrderStatus,
    PrintSize,
    PrintType,
    RootType,
    TextLocation,
    TreeStatus,
    TreeStyle,
    TreeType
  } from '$lib/models/order.js';
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
  import type { Order } from '@types/global';

  export let order: Order;

  let dirty = false;
  let originalOrder;
  onMount(() => {
    if (!originalOrder) originalOrder = { ...order };
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

  const sumOperatingCosts = (order: Order): string => {
    const value =
      order.printCost +
      order.shippingCost -
      order.printExpense -
      order.shippingExpense -
      order.tax;
    const format = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    });
    return format.format(value);
  };
</script>

<div class="wrapper">
  <div class="body">
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

      {#if order.type == TreeType.ANCESTRY || order.type == TreeType.ANCESTRY_ROOTS}
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

      {#if order.type == TreeType.ANCESTRY_ROOTS || order.type == TreeType.DESCENDANT_ROOTS}
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

      {#if order.treeStyle == TreeStyle.CLASSIC}
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

      {#if order.printType != PrintType.DIGITAL}
        <LabeledInput
          id="print-size"
          bind:value={order.printSize}
          options={Object.values(PrintSize)}
        >
          Print Size
        </LabeledInput>
      {/if}
    </div>
  </div>
  <div class="aside">
    <div class="aside-content">
      <LabeledInput
        bind:value={order.shippingCost}
        id="shipping-cost"
        type="number"
      >
        Shipping Cost
      </LabeledInput>
      <h2>Out</h2>
      <LabeledInput
        bind:value={order.printExpense}
        id="print-expense"
        type="number"
      >
        Print
      </LabeledInput>
      <LabeledInput
        bind:value={order.shippingExpense}
        id="shipping-expense"
        type="number"
      >
        Shipping
      </LabeledInput>
      <LabeledInput bind:value={order.tax} id="tax" type="number">
        Tax
      </LabeledInput>
      <hr />
      <LabeledInput readonly type="text" value={sumOperatingCosts(order)}>
        Total
      </LabeledInput>
      <div class="sp-in">
        <input
          class="sp-input"
          name="test"
          placeholder=" "
          type="number"
          value="100"
        />
        <label for="test">Test</label>
      </div>
    </div>
  </div>
</div>
{#if dirty}
  <footer>
    There are unsaved changes on this order. Please save now to avoid losing
    changes.
    <button class="save-button" on:click={() => saveOrder()}>
      Save Order
    </button>
  </footer>
{/if}

<style>
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
  }

  .aside {
    margin-left: 0.5rem;
    padding-left: 0.5rem;
    border-left: 2px groove rgba(0, 0, 0, 0.4);
  }

  /*.aside-content {*/
  /*  position: sticky;*/
  /*  top: 0;*/
  /*}*/

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
  }

  .save-button:hover {
    cursor: pointer;
    box-shadow: 0.2rem 0.2rem 0.3rem #333;
  }

  .save-button:active {
    cursor: pointer;
    box-shadow: inset -0.2rem -0.2rem 0.3rem #333;
  }

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
  .sp-in:has(input:focus) label {
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
</style>
