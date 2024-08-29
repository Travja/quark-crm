<script lang="ts">
  import { PrintSize, PrintType } from '$lib/models/order.js';
  import InsetInput from '$lib/ui/InsetInput.svelte';
  import Pill from '$lib/ui/Pill.svelte';
  import type { AdditionalPrint } from '@types/global';
  import { createEventDispatcher } from 'svelte';

  let print: AdditionalPrint = {
    quantity: 1,
    printType: PrintType.STANDARD,
    printSize: PrintSize.EIGHT_BY_TEN,
    frame: undefined,
    cost: 0,
    frameCost: 0
  };

  const dispatch = createEventDispatcher();
</script>

<InsetInput
  bind:value={print.quantity}
  id="new-print-quantity"
  type="number"
  min="1"
>
  Quantity
</InsetInput>
<InsetInput
  bind:value={print.printType}
  id="new-print-type"
  type="dropdown"
  on:change={() => {
    if (print.printType === PrintType.DIGITAL) {
      print.printSize = undefined;
    }
    if (
      print.printType === PrintType.CANVAS ||
      print.printType === PrintType.DIGITAL
    ) {
      print.frame = undefined;
      print.frameCost = 0;
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
{#if print.printType !== PrintType.DIGITAL}
  <InsetInput bind:value={print.printSize} id="new-print-size" type="dropdown">
    <svelte:fragment slot="dropdown">
      {#each Object.values(PrintSize) as size}
        <option value={size}>{size}</option>
      {/each}
    </svelte:fragment>
    <span slot="default">Print Size</span>
  </InsetInput>
  {#if print.printType !== PrintType.CANVAS}
    <InsetInput bind:value={print.frame} id="new-print-frame" type="text">
      Frame
    </InsetInput>
  {/if}
{/if}
<InsetInput bind:value={print.cost} id="new-print-cost" type="number" min="0">
  Print Cost
</InsetInput>
{#if print.frame}
  <InsetInput
    bind:value={print.frameCost}
    id="new-print-frame-cost"
    type="number"
    min="0"
  >
    Frame Cost
  </InsetInput>
{/if}
<Pill color="#5276ff" hover on:click={() => dispatch('addPrint', print)}>
  <span class="material-symbols-outlined">save</span>
</Pill>
<Pill color="red" hover on:click={() => dispatch('close')}>
  <span class="material-symbols-outlined">close</span>
</Pill>
