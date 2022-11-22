<!--suppress XmlInvalidId -->
<script lang='ts'>
  import type { Order } from '$lib/models/order';
  import LabeledInput from '$lib/ui/LabeledInput.svelte';
  import { BranchStyle, TextLocation, TreeType } from '$lib/models/order.js';

  export let order: Order;
</script>

<div class='column'>
  Order ID: {order.id}
  <LabeledInput id='order-status'
                bind:value={order.status}>
    Order Status
  </LabeledInput>
  <LabeledInput id='order-date'
                type='date'
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

  <LabeledInput id='history' type='textarea' placeholder='No history 😨'>
    History
  </LabeledInput>
</div>

<div class='column'>
  <LabeledInput id='tree-type' bind:value={order.type}>
    Tree Type
  </LabeledInput>

  {#if order.type == TreeType.ANCESTRY || order.type == TreeType.ANCESTRY_ROOTS}
    <LabeledInput id='ancestryType' bind:value={order.ancestryType}>
      Ancestry Type
    </LabeledInput>
  {/if}

  <LabeledInput id='generations' bind:value={order.generations} type='number'>
    Generations
  </LabeledInput>

  <div class='section'>
    <div class='head'>Branch Style</div>
    <LabeledInput type='radio' id='style-1' bind:group={order.branchStyle}
                  value='{BranchStyle.STYLE_1}'>
      <svelte:fragment slot='value'>1</svelte:fragment>
    </LabeledInput>

    <LabeledInput type='radio' id='style-2' bind:group={order.branchStyle}
                  value='{BranchStyle.STYLE_2}'>
      <svelte:fragment slot='value'>2</svelte:fragment>
    </LabeledInput>
  </div>

  <LabeledInput id='background' bind:value={order.background}>
    Background
  </LabeledInput>

  <LabeledInput id='fontColor' bind:value={order.fontColor}>
    Font Color
  </LabeledInput>
</div>

{#if order.familyName}
  <div class='column'>
    <LabeledInput id='familyName' bind:value={order.familyName}>
      Family Name
    </LabeledInput>

    {#if order.established}
      <LabeledInput id='established' bind:value={order.established}>
        Established
      </LabeledInput>
    {/if}

    <div class='section'>
      <LabeledInput type='radio' id='left' bind:group={order.nameLocation}
                    value='{TextLocation.LEFT}'>
        <svelte:fragment slot='value'>Left</svelte:fragment>
      </LabeledInput>

      <LabeledInput type='radio' id='right' bind:group={order.nameLocation}
                    value='{TextLocation.RIGHT}'>
        <svelte:fragment slot='value'>Right</svelte:fragment>
      </LabeledInput>
    </div>

    <LabeledInput id='familyFont' bind:value={order.familyFont}>
      Family Font
    </LabeledInput>
  </div>
{/if}

<div class='column'>
  <LabeledInput id='notes' type='textarea' placeholder='Notes...' bind:value={order.notes}>
    Order Notes
  </LabeledInput>

  {#if order.groundText}
    <LabeledInput id='groundText' placeholder='Ground Text' bind:value={order.groundText}>
      Ground Text
    </LabeledInput>

    <LabeledInput id='groundFont' bind:value={order.groundFont}>
      Ground Font
    </LabeledInput>
  {/if}

  {#if order.quote}
    <LabeledInput id='quote' bind:value={order.quote}>
      Quote
    </LabeledInput>

    <LabeledInput id='quoteFont' bind:value={order.quoteFont}>
      Quote Font
    </LabeledInput>

    <div class='section'>
      <LabeledInput type='radio' id='left' bind:group={order.quoteLocation}
                    value='{TextLocation.LEFT}'>
        <svelte:fragment slot='value'>Left</svelte:fragment>
      </LabeledInput>

      {#if !order.groundText}
        <LabeledInput type='radio' id='left' bind:group={order.quoteLocation}
                      value='{TextLocation.CENTER}'>
          <svelte:fragment slot='value'>Center</svelte:fragment>
        </LabeledInput>
      {/if}

      <LabeledInput type='radio' id='right' bind:group={order.quoteLocation}
                    value='{TextLocation.RIGHT}'>
        <svelte:fragment slot='value'>Right</svelte:fragment>
      </LabeledInput>
    </div>
  {/if}
</div>

<style>
  .column {
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
</style>