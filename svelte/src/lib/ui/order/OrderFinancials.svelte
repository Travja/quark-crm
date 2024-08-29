<script lang="ts">
  import {
    formatCurrency,
    sumExpenses,
    sumOperatingCosts,
    totalOperatingCosts
  }                     from '$lib/api/util';
  import type { Order } from '@types/global';
  import InsetInput     from '$lib/ui/InsetInput.svelte';

  export let order: Order;
</script>

<h2>Financials</h2>
<h3>
  In: <span class="income">{formatCurrency(sumOperatingCosts(order))}</span>
</h3>
<InsetInput bind:value={order.creationCost} id="creation-cost" type="number">
  Creation
</InsetInput>
{#if order.roots}
  <InsetInput bind:value={order.rootCost} id="root-cost" type="number">
    Roots
  </InsetInput>
{/if}
{#if order.hasDateBranches}
  <InsetInput bind:value={order.dateBranchCost} id="date-branch-cost">
    Date Branches
  </InsetInput>
{/if}
{#if order.hasLeaves}
  <InsetInput bind:value={order.leafCost} id="leaf-cost" type="number">
    Leaves
  </InsetInput>
{/if}
{#if order.printSize}
  <InsetInput bind:value={order.printCost} id="print-cost" type="number">
    Print
  </InsetInput>
  {#if order.frame}
    <InsetInput bind:value={order.frameCost} id="frame-cost" type="number">
      Frame
    </InsetInput>
  {/if}
  {#if order.additionalPrints}
    <InsetInput
      value={order.additionalPrints
        .map((p) => p.cost + p.frameCost)
        .reduce((a, b) => a + b, 0)}
      id="additional-print-cost"
      type="number"
    >
      Additional Prints
    </InsetInput>
  {/if}
  <InsetInput bind:value={order.shippingCost} id="shipping-cost" type="number">
    Shipping
  </InsetInput>
{/if}
<InsetInput bind:value={order.customCharge} id="custom-expense">
  Custom
</InsetInput>

<h3>
  Out: <span class="expense">{formatCurrency(sumExpenses(order))}</span>
</h3>
{#if order.printSize}
  <InsetInput bind:value={order.printExpense} id="print-expense" type="number">
    Prints
  </InsetInput>
  {#if order.frame}
    <InsetInput
      bind:value={order.frameExpense}
      id="frame-expense"
      type="number"
    >
      Frames
    </InsetInput>
  {/if}
  <InsetInput
    bind:value={order.shippingExpense}
    id="shipping-expense"
    type="number"
  >
    Shipping
  </InsetInput>
{/if}
<InsetInput bind:value={order.tax} id="tax" type="number">Tax</InsetInput>
<InsetInput bind:value={order.fees} id="fees" type="number">Fees</InsetInput>
<InsetInput bind:value={order.customExpense} id="custom-charge">
  Custom
</InsetInput>
<hr />
<h2>
  Profit: <span class="profit"
    >{formatCurrency(totalOperatingCosts(order))}</span
  >
</h2>
