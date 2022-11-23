<!--suppress XmlInvalidId -->
<script lang='ts'>
  import type { Order } from '$lib/models/order';
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

  export let order: Order;

  let dirty = false;
  let originalOrder;
  onMount(() => {
    if (!originalOrder)
      originalOrder = { ...order };
  });

  $: if (originalOrder && order) dirty = JSON.stringify(order) != JSON.stringify(originalOrder);
  $: if (dirty) {
    console.log('og', JSON.stringify(originalOrder));
    console.log('dirty', JSON.stringify(order));
  }

  const saveOrder = (): void => {
    fetch('http://localhost:8080/order', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(order)
    })
      .then((res: any) => <Order>res.json())
      .then((ord: Order) => {
        order = ord;
        order.requestDate = order.requestDate + ".000";
        originalOrder = { ...order };
        dirty = false;
      })
      .catch(err => console.error('Error updating order', err));
  };
</script>

<div class='wrapper'>
  <div class='column'>
    Order ID: {order.id}
    <LabeledInput id='order-status'
                  bind:value={order.status}
                  options='{Object.values(OrderStatus)}'>
      Order Status
    </LabeledInput>
    <LabeledInput id='tree-status'
                  bind:value={order.treeStatus}
                  options='{Object.values(TreeStatus)}'>
      Tree Status
    </LabeledInput>
    <LabeledInput id='order-date'
                  type='datetime'
                  bind:value={order.created}>
      Order Date
    </LabeledInput>

    <LabeledInput id='request-date'
                  type='date'
                  bind:value={order.requestDate}>
      Due Date
    </LabeledInput>

    <LabeledInput id='artist'
                  bind:value={order.artist}>
      Artist
    </LabeledInput>

    <LabeledInput id='history' type='textarea' placeholder='No history 😨' fillSpace={true}>
      History
    </LabeledInput>
  </div>

  <div class='column'>
    <LabeledInput id='tree-type' bind:value={order.type}
                  options='{Object.values(TreeType)}'>
      Tree Type
    </LabeledInput>

    {#if order.type == TreeType.ANCESTRY || order.type == TreeType.ANCESTRY_ROOTS}
      <LabeledInput id='ancestryType' bind:value={order.ancestryType}
                    options='{Object.values(AncestryType)}' />
    {/if}

    <LabeledInput id='generations' bind:value={order.generations} type='number'>
      Generations
    </LabeledInput>

    {#if order.type == TreeType.ANCESTRY_ROOTS || order.type == TreeType.DESCENDANT_ROOTS}
      <LabeledInput id='roots' bind:value={order.roots}
                    options='{Object.values(RootType)}'>
        Roots
      </LabeledInput>
    {/if}

    <div class='section'>
      <label class='head' for='branch-style'>Branch Style</label>
      <LabeledInput type='radio' id='branch-style' bind:group={order.branchStyle}
                    fillSpace={true}
                    value='{BranchStyle.STYLE_1}'>
        <svelte:fragment slot='value'>1</svelte:fragment>
      </LabeledInput>

      <LabeledInput type='radio' id='style-2' bind:group={order.branchStyle}
                    fillSpace={true}
                    value='{BranchStyle.STYLE_2}'>
        <svelte:fragment slot='value'>2</svelte:fragment>
      </LabeledInput>
    </div>

    <div class='section'>
      <label class='head' for='tree-style'>Tree Style</label>
      <LabeledInput type='radio' id='classic-style' bind:group={order.treeStyle}
                    fillSpace={true}
                    value='{TreeStyle.CLASSIC}'>
        <svelte:fragment slot='value'>Classic</svelte:fragment>
      </LabeledInput>

      <LabeledInput type='radio' id='chalk-style' bind:group={order.treeStyle}
                    fillSpace={true}
                    value='{TreeStyle.CHALK}'>
        <svelte:fragment slot='value'>Chalk</svelte:fragment>
      </LabeledInput>
    </div>

    <LabeledInput id='background' bind:value={order.background}>
      Background
    </LabeledInput>

    {#if order.treeStyle == TreeStyle.CLASSIC}
      <LabeledInput id='fontColor' bind:value={order.fontColor}
                    options='{Object.values(FontColor)}'>
        Font Color
      </LabeledInput>
    {/if}
  </div>

  <div class='column'>
    <LabeledInput id='familyName' bind:value={order.familyName}>
      Family Name
    </LabeledInput>

    {#if order.familyName}
      <div class='section'>
        <LabeledInput type='radio' id='name-left' bind:group={order.nameLocation}
                      fillSpace={true}
                      value='{TextLocation.LEFT}'>
          <svelte:fragment slot='value'>Left</svelte:fragment>
        </LabeledInput>

        {#if !order.groundText}
          <LabeledInput type='radio' id='quote-center' bind:group={order.nameLocation}
                        fillSpace={true}
                        value='{TextLocation.CENTER}'>
            <svelte:fragment slot='value'>Center</svelte:fragment>
          </LabeledInput>
        {/if}

        <LabeledInput type='radio' id='name-right' bind:group={order.nameLocation}
                      fillSpace={true}
                      value='{TextLocation.RIGHT}'>
          <svelte:fragment slot='value'>Right</svelte:fragment>
        </LabeledInput>
      </div>

      <!--{#if order.established}-->
      <LabeledInput id='established' bind:value={order.established}>
        Established
      </LabeledInput>
      <!--{/if}-->

      <LabeledInput id='familyFont' bind:value={order.familyFont}>
        Family Font
      </LabeledInput>
    {/if}

    <div class='wrapper'>
      <LabeledInput id='leaves' bind:value={order.hasLeaves} type='checkbox'>
        Leaves
      </LabeledInput>

      <LabeledInput id='date-branches' bind:value={order.hasDateBranches} type='checkbox'>
        Date Branches
      </LabeledInput>
    </div>

    {#if order.hasDateBranches}
      <LabeledInput id='num-date-branches' bind:value={order.branchesAmount}>
        Number of Branches
      </LabeledInput>
    {/if}

    <LabeledInput id='comments' type='textarea' bind:value={order.comments} fillSpace={true}>
      Comments
    </LabeledInput>
  </div>

  <div class='column'>
    <LabeledInput id='notes' type='textarea' placeholder='Notes...' bind:value={order.notes} fillSpace={true}>
      Order Notes
    </LabeledInput>

    <LabeledInput id='groundText' bind:value={order.groundText}>
      Ground Text
    </LabeledInput>

    {#if order.groundText}
      <LabeledInput id='groundFont' bind:value={order.groundFont}>
        Ground Font
      </LabeledInput>
    {/if}

    <LabeledInput id='quote' bind:value={order.quote}>
      Quote
    </LabeledInput>

    {#if order.quote}
      <div class='section' transition:slide|local>
        <LabeledInput type='radio' id='quote-left' bind:group={order.quoteLocation}
                      fillSpace={true}
                      value='{TextLocation.LEFT}'>
          <svelte:fragment slot='value'>Left</svelte:fragment>
        </LabeledInput>

        <LabeledInput type='radio' id='quote-right' bind:group={order.quoteLocation}
                      fillSpace={true}
                      value='{TextLocation.RIGHT}'>
          <svelte:fragment slot='value'>Right</svelte:fragment>
        </LabeledInput>
      </div>

      <LabeledInput id='quoteFont' bind:value={order.quoteFont}>
        Quote Font
      </LabeledInput>
    {/if}

    <LabeledInput id='print-type' bind:value={order.printType}
                  options='{Object.values(PrintType)}'>
      Print Type
    </LabeledInput>

    {#if order.printType}
      <LabeledInput id='print-size' bind:value={order.printSize}
                    options='{Object.values(PrintSize)}'>
        Print Size
      </LabeledInput>
    {/if}
  </div>
</div>
<hr />
<div class='wrapper'>
  <div class='column'>
    <LabeledInput value='{order.cost}'>
      Profit
    </LabeledInput>
  </div>
  <div class='column'>
    <LabeledInput value='{order.cost}'>
      Profit
    </LabeledInput>
  </div>
</div>
{#if dirty}
  <footer>
    There are unsaved changes on this order. Please save now to avoid losing changes.
    <button class='save-button' on:click={() => saveOrder()}>
      Save Order
    </button>
  </footer>
{/if}

<style>
  .wrapper {
    width: 100%;
    display: flex;
    justify-content: space-around;
  }

  hr {
    width: 100%;
    box-sizing: border-box;
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
</style>